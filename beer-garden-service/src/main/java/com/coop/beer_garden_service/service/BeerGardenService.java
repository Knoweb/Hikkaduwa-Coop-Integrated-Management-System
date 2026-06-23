package com.coop.beer_garden_service.service;

import com.coop.beer_garden_service.dto.InvoiceRequest;
import com.coop.beer_garden_service.dto.PaymentRequest;
import com.coop.beer_garden_service.dto.InvoiceResponse;
import com.coop.beer_garden_service.dto.PaymentResponse;
import com.coop.beer_garden_service.entity.IssuanceInvoice;
import com.coop.beer_garden_service.entity.PaymentRecord;
import com.coop.beer_garden_service.entity.BeerGardenGrn;
import com.coop.beer_garden_service.entity.GrnItem;
import com.coop.beer_garden_service.repository.IssuanceInvoiceRepository;
import com.coop.beer_garden_service.repository.IssuanceItemRepository; // <-- ADDED THIS
import com.coop.beer_garden_service.repository.PaymentRecordRepository;
import com.coop.beer_garden_service.repository.BeerGardenGrnRepository;
import com.coop.beer_garden_service.repository.SupplierRepository;
import com.coop.beer_garden_service.repository.BeerItemRepository;

import com.coop.beer_garden_service.entity.AuditLog;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BeerGardenService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private IssuanceInvoiceRepository invoiceRepository;

    @Autowired
    private IssuanceItemRepository issuanceItemRepository; // <-- ADDED THIS

    @Autowired
    private PaymentRecordRepository paymentRepository;

    @Autowired
    private BeerGardenGrnRepository grnRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private BeerItemRepository beerItemRepository;

    public List<InvoiceResponse> getReceivables() {
        List<IssuanceInvoice> invoices = invoiceRepository.findAll();

        return invoices.stream().map(inv -> {
            InvoiceResponse dto = new InvoiceResponse();
            dto.setId(inv.getId());
            dto.setInvoiceNumber(inv.getInvoiceNumber());
            dto.setOperatorName(inv.getOperatorName());
            dto.setIssuedDate(inv.getIssuedDate());
            dto.setGrandTotal(inv.getGrandTotal());
            dto.setStatus(inv.getStatus());
            dto.setPriorityLevel(inv.getPriorityLevel());
            dto.setTotalStockValue(inv.getTotalStockValue());
            dto.setTotalCommission(inv.getTotalCommission());

            BigDecimal totalPaid = paymentRepository.sumPaymentsByInvoice(inv.getId());
            dto.setBalanceDue(inv.getGrandTotal().subtract(totalPaid != null ? totalPaid : BigDecimal.ZERO));

            long days = ChronoUnit.DAYS.between(inv.getIssuedDate(), LocalDateTime.now());
            dto.setDaysOutstanding(days);

            if (days >= 30 && !"PAID".equals(inv.getStatus())) {
                dto.setOverdue(true);
            } else {
                dto.setOverdue(false);
            }

            return dto;
        }).collect(Collectors.toList());
    }

    // --- THE ONLY createIssuance METHOD ---
    @Transactional
    public IssuanceInvoice createIssuance(InvoiceRequest request) {
        BigDecimal totalStockValue = request.getTotalLiquorValue();
        int totalQuantity = request.getItems().stream()
                .mapToInt(InvoiceRequest.InvoiceItem::getQuantity)
                .sum();

        BigDecimal commissionTotal = request.getCommissionPerUnit().multiply(new BigDecimal(totalQuantity));
        BigDecimal grandTotal = totalStockValue.add(commissionTotal);

        // 1. Save the Parent Invoice
        IssuanceInvoice invoice = new IssuanceInvoice();
        invoice.setInvoiceNumber("INV-" + System.currentTimeMillis() % 1000000000);
        invoice.setOperatorName(request.getRestaurantOperatorName());
        invoice.setTotalStockValue(totalStockValue);
        invoice.setTotalCommission(commissionTotal);
        invoice.setGrandTotal(grandTotal);
        invoice.setIssuedDate(LocalDateTime.now());
        invoice.setIssuedByRole("ROLE_ADMIN");
        invoice.setStatus("UNPAID");

        invoice = invoiceRepository.save(invoice);

        // 2. Loop through the cart, DEDUCT STOCK, and save line items
        for (InvoiceRequest.InvoiceItem itemReq : request.getItems()) {

            // Find the beer using the NAME sent from the frontend
            com.coop.beer_garden_service.entity.BeerItem beerItem = beerItemRepository.findById(itemReq.getBeerItemId())
                    .orElseThrow(() -> new RuntimeException("Beer item not found in database for ID: " + itemReq.getBeerItemId()));
            // Prevent selling negative stock
            if (beerItem.getCurrentStock() < itemReq.getQuantity()) {
                throw new RuntimeException("Insufficient stock for " + beerItem.getBeerName() + ". Only " + beerItem.getCurrentStock() + " left.");
            }

            // DEDUCT THE STOCK
            beerItem.setCurrentStock(beerItem.getCurrentStock() - itemReq.getQuantity());
            beerItemRepository.save(beerItem);

            // SAVE THE ITEM TO THE NEW SQL TABLE
            com.coop.beer_garden_service.entity.IssuanceItem issuanceItem = new com.coop.beer_garden_service.entity.IssuanceItem();
            issuanceItem.setInvoiceId(invoice.getId());
            issuanceItem.setBeerItemId(beerItem.getId());
            issuanceItem.setQuantity(itemReq.getQuantity());
            issuanceItem.setUnitPrice(beerItem.getUnitPrice());
            issuanceItem.setCommissionPerBottle(request.getCommissionPerUnit());

            BigDecimal lineTotal = beerItem.getUnitPrice().multiply(new BigDecimal(itemReq.getQuantity()));
            issuanceItem.setLineTotal(lineTotal);

            // Save the line item record
            issuanceItemRepository.save(issuanceItem);
            AuditLog log = AuditLog.builder()
                    .userId(currentUserUuid)
                    .serviceName("BEER-GARDEN-SERVICE")
                    .action("CREATE_ISSUANCE")
                    .description("Beer issuance to restaurant: " + request.getDetails())
                    .build();

            restTemplate.postForObject("http://ADMIN-SERVICE/api/v1/admin/logs", log, AuditLog.class);
        }

        return invoice;
    }

    @Transactional
    public void processPayment(UUID invoiceId, PaymentRequest request) {
        IssuanceInvoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        PaymentRecord payment = new PaymentRecord();
        payment.setInvoice(invoice);
        payment.setAmountPaid(request.getAmount());
        payment.setPaymentMethod(request.getMethod());
        payment.setChequeRef(request.getReference());
        payment.setPaymentDate(LocalDateTime.now());
        paymentRepository.save(payment);

        BigDecimal totalPaid = paymentRepository.sumPaymentsByInvoice(invoiceId);

        if (totalPaid.compareTo(invoice.getGrandTotal()) >= 0) {
            invoice.setStatus("PAID");
        } else {
            invoice.setStatus("PARTIALLY_PAID");
        }

        invoiceRepository.save(invoice);
    }

    @Transactional
    public void updatePriority(UUID invoiceId, String priorityLevel) {
        IssuanceInvoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        invoice.setPriorityLevel(priorityLevel);
        invoiceRepository.save(invoice);
    }

    public List<PaymentResponse> getPaymentHistory() {
        return paymentRepository.findAll().stream().map(p -> {
                    PaymentResponse dto = new PaymentResponse();
                    dto.setInvoiceNumber(p.getInvoice().getInvoiceNumber());
                    dto.setOperatorName(p.getInvoice().getOperatorName());
                    dto.setAmountPaid(p.getAmountPaid());
                    dto.setPaymentMethod(p.getPaymentMethod());
                    dto.setChequeRef(p.getChequeRef());
                    dto.setPaymentDate(p.getPaymentDate());
                    return dto;
                })
                .sorted((a, b) -> b.getPaymentDate().compareTo(a.getPaymentDate()))
                .collect(Collectors.toList());
    }

    public List<BeerGardenGrn> getGrnHistory() {
        return grnRepository.findAll().stream()
                .sorted((a, b) -> b.getReceivedDate().compareTo(a.getReceivedDate()))
                .collect(Collectors.toList());
    }

    @Transactional
    public BeerGardenGrn createGrn(com.coop.beer_garden_service.dto.GrnRequest request) {

        com.coop.beer_garden_service.entity.Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        BeerGardenGrn grn = new BeerGardenGrn();
        grn.setGrnNumber(request.getInvoiceReference() != null ? request.getInvoiceReference() : "GRN-" + System.currentTimeMillis() % 1000000);
        grn.setSupplierName(supplier.getSupplierName());
        grn.setReceivedDate(LocalDateTime.now());

        BigDecimal totalAmount = BigDecimal.ZERO;

        if (request.getItems() != null) {
            for (com.coop.beer_garden_service.dto.GrnRequest.GrnItemRequest itemReq : request.getItems()) {

                BigDecimal lineTotal = itemReq.getUnitCost().multiply(new BigDecimal(itemReq.getQuantity()));
                totalAmount = totalAmount.add(lineTotal);

                com.coop.beer_garden_service.entity.BeerItem beerItem = beerItemRepository.findById(itemReq.getBeerItemId())
                        .orElseThrow(() -> new RuntimeException("Beer item not found"));
                beerItem.setCurrentStock(beerItem.getCurrentStock() + itemReq.getQuantity());
                beerItemRepository.save(beerItem);

                GrnItem grnItem = new GrnItem();
                grnItem.setGrnInvoice(grn);
                grnItem.setBeerItemId(itemReq.getBeerItemId());
                grnItem.setQuantity(itemReq.getQuantity());
                grnItem.setUnitCost(itemReq.getUnitCost());
                grnItem.setLineTotal(lineTotal);

                grn.getItems().add(grnItem);
            }
        }

        BigDecimal amountPaid = request.getAmountPaid() != null ? request.getAmountPaid() : BigDecimal.ZERO;
        BigDecimal balanceToAdd = totalAmount.subtract(amountPaid);

        if ("CREDIT".equalsIgnoreCase(request.getPaymentMethod()) && balanceToAdd.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal currentBalance = supplier.getOutstandingBalance() != null ? supplier.getOutstandingBalance() : BigDecimal.ZERO;
            supplier.setOutstandingBalance(currentBalance.add(balanceToAdd));
            supplierRepository.save(supplier);
        }

        grn.setTotalAmount(totalAmount);
        grn.setAmountPaid(amountPaid);
        grn.setStatus(balanceToAdd.compareTo(BigDecimal.ZERO) <= 0 ? "PAID" : "CREDIT");

        return grnRepository.save(grn);
    }

    public List<java.util.Map<String, Object>> getDetailedPurchaseHistory() {
        List<BeerGardenGrn> grns = grnRepository.findAll();
        List<java.util.Map<String, Object>> resultList = new java.util.ArrayList<>();

        for (BeerGardenGrn grn : grns) {
            for (GrnItem item : grn.getItems()) {

                String beerName = "Unknown Beer";
                try {
                    beerName = beerItemRepository.findById(item.getBeerItemId()).get().getBeerName();
                } catch (Exception e) {}

                java.util.Map<String, Object> map = new java.util.HashMap<>();
                map.put("id", java.util.UUID.randomUUID().toString());
                map.put("grnNumber", grn.getGrnNumber());
                map.put("receivedDate", grn.getReceivedDate());
                map.put("supplierName", grn.getSupplierName());
                map.put("beerName", beerName);
                map.put("quantity", item.getQuantity());
                map.put("unitPrice", item.getUnitCost());
                map.put("totalPrice", item.getLineTotal());
                map.put("amountPaid", grn.getAmountPaid());

                BigDecimal balanceDue = grn.getTotalAmount().subtract(grn.getAmountPaid() != null ? grn.getAmountPaid() : BigDecimal.ZERO);
                map.put("balanceDue", balanceDue);

                resultList.add(map);
            }
        }

        resultList.sort((a, b) -> ((LocalDateTime) b.get("receivedDate")).compareTo((LocalDateTime) a.get("receivedDate")));
        return resultList;
    }

    public List<BeerGardenGrn> getUnpaidGrnsBySupplier(UUID supplierId) {
        com.coop.beer_garden_service.entity.Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        return grnRepository.findAll().stream()
                .filter(g -> g.getSupplierName().equals(supplier.getSupplierName()) && !"PAID".equals(g.getStatus()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void processSupplierPayment(com.coop.beer_garden_service.dto.SupplierPaymentRequest request) {

        com.coop.beer_garden_service.entity.Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        BigDecimal paymentAmount = request.getAmount();
        BigDecimal currentBalance = supplier.getOutstandingBalance() != null ? supplier.getOutstandingBalance() : BigDecimal.ZERO;
        supplier.setOutstandingBalance(currentBalance.subtract(paymentAmount));
        supplierRepository.save(supplier);

        if (request.getGrnId() != null) {
            BeerGardenGrn grn = grnRepository.findById(request.getGrnId())
                    .orElseThrow(() -> new RuntimeException("GRN not found"));

            BigDecimal grnTotal = grn.getTotalAmount() != null ? grn.getTotalAmount() : BigDecimal.ZERO;
            BigDecimal grnAlreadyPaid = grn.getAmountPaid() != null ? grn.getAmountPaid() : BigDecimal.ZERO;

            BigDecimal newPaidAmount = grnAlreadyPaid.add(paymentAmount);
            grn.setAmountPaid(newPaidAmount);

            if (newPaidAmount.compareTo(grnTotal) >= 0) {
                grn.setStatus("PAID");
            } else {
                grn.setStatus("PARTIALLY_PAID");
            }
            grnRepository.save(grn);
        }
    }
}