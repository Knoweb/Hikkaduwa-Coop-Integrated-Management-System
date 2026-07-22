package com.hikkaduwa.milk_shop_service.service;

import com.hikkaduwa.milk_shop_service.dto.GrnItemRequest;
import com.hikkaduwa.milk_shop_service.dto.GrnRequest;
import com.hikkaduwa.milk_shop_service.dto.GrnResponse;
import com.hikkaduwa.milk_shop_service.entity.ItemProduct;
import com.hikkaduwa.milk_shop_service.entity.PurchaseInvoice;
import com.hikkaduwa.milk_shop_service.entity.PurchaseInvoiceItem;
import com.hikkaduwa.milk_shop_service.entity.StockLedger;
import com.hikkaduwa.milk_shop_service.entity.Supplier;
import com.hikkaduwa.milk_shop_service.repository.ItemProductRepository;
import com.hikkaduwa.milk_shop_service.repository.PurchaseInvoiceItemRepository;
import com.hikkaduwa.milk_shop_service.repository.PurchaseInvoiceRepository;
import com.hikkaduwa.milk_shop_service.repository.StockLedgerRepository;
import com.hikkaduwa.milk_shop_service.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GrnService {

    private final PurchaseInvoiceRepository purchaseInvoiceRepository;
    private final PurchaseInvoiceItemRepository purchaseInvoiceItemRepository;
    private final SupplierRepository supplierRepository;
    private final ItemProductRepository itemProductRepository;
    private final StockLedgerRepository stockLedgerRepository;

    public GrnResponse createGrn(GrnRequest request) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        String invoiceNumber = request.getInvoiceNumber();
        if (invoiceNumber == null || invoiceNumber.trim().isEmpty()) {
            invoiceNumber = generateNextInvoiceNumber();
        } else {
            if (purchaseInvoiceRepository.existsByInvoiceNumber(invoiceNumber)) {
                throw new RuntimeException("Invoice number already exists: " + invoiceNumber);
            }
        }

        BigDecimal totalAmount = calculateTotalAmount(request.getItems());

        PurchaseInvoice purchaseInvoice = PurchaseInvoice.builder()
                .supplier(supplier)
                .invoiceNumber(invoiceNumber)
                .invoiceDate(request.getInvoiceDate())
                .totalAmount(totalAmount)
                .remarks(request.getRemarks())
                .createdAt(LocalDateTime.now())
                .build();

        PurchaseInvoice savedInvoice = purchaseInvoiceRepository.save(purchaseInvoice);

        for (GrnItemRequest itemRequest : request.getItems()) {
            ItemProduct item = itemProductRepository.findById(itemRequest.getItemId())
                    .orElseThrow(() -> new RuntimeException("Item not found"));

            BigDecimal lineTotal = itemRequest.getUnitPrice()
                    .multiply(BigDecimal.valueOf(itemRequest.getQuantity()));

            PurchaseInvoiceItem invoiceItem = PurchaseInvoiceItem.builder()
                    .purchaseInvoice(savedInvoice)
                    .item(item)
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(itemRequest.getUnitPrice())
                    .lineTotal(lineTotal)
                    .build();

            purchaseInvoiceItemRepository.save(invoiceItem);

            increaseStock(item, itemRequest.getQuantity());
        }

        return buildResponse(savedInvoice);
    }

    public List<GrnResponse> getAllGrns() {
        return purchaseInvoiceRepository.findAllByOrderByInvoiceDateDesc()
                .stream()
                .map(this::buildResponse)
                .toList();
    }

    private BigDecimal calculateTotalAmount(List<GrnItemRequest> items) {
        return items.stream()
                .map(item -> item.getUnitPrice()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public String generateNextInvoiceNumber() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String prefix = "GRN-" + datePart + "-";

        Optional<PurchaseInvoice> lastInvoiceOpt = purchaseInvoiceRepository
                .findFirstByInvoiceNumberStartingWithOrderByInvoiceNumberDesc(prefix);

        if (lastInvoiceOpt.isPresent() && lastInvoiceOpt.get().getInvoiceNumber() != null) {
            String lastInvoiceNumber = lastInvoiceOpt.get().getInvoiceNumber();
            String numberPart = lastInvoiceNumber.replace(prefix, "");
            try {
                int lastNumber = Integer.parseInt(numberPart);
                return prefix + String.format("%03d", lastNumber + 1);
            } catch (NumberFormatException e) {
                return prefix + "001";
            }
        }

        return prefix + "001";
    }

    private void increaseStock(ItemProduct item, Integer quantity) {
        StockLedger stockLedger = stockLedgerRepository.findByItemId(item.getId())
                .orElseGet(() -> StockLedger.builder()
                        .item(item)
                        .currentQty(0)
                        .lastUpdated(LocalDateTime.now())
                        .build());

        stockLedger.setCurrentQty(stockLedger.getCurrentQty() + quantity);
        stockLedger.setLastUpdated(LocalDateTime.now());

        stockLedgerRepository.save(stockLedger);
    }

    private GrnResponse buildResponse(PurchaseInvoice purchaseInvoice) {
        List<PurchaseInvoiceItem> invoiceItems =
                purchaseInvoiceItemRepository.findByPurchaseInvoice(purchaseInvoice);

        List<GrnResponse.GrnResponseItem> responseItems = invoiceItems.stream()
                .map(item -> GrnResponse.GrnResponseItem.builder()
                        .itemName(item.getItem().getName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .lineTotal(item.getLineTotal())
                        .build())
                .toList();

        return GrnResponse.builder()
                .id(purchaseInvoice.getId())
                .supplierName(purchaseInvoice.getSupplier().getName())
                .invoiceNumber(purchaseInvoice.getInvoiceNumber())
                .invoiceDate(purchaseInvoice.getInvoiceDate())
                .totalAmount(purchaseInvoice.getTotalAmount())
                .remarks(purchaseInvoice.getRemarks())
                .items(responseItems)
                .build();
    }
}