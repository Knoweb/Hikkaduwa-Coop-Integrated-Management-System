package com.hikkaduwa.milk_shop_service.service;

import com.hikkaduwa.milk_shop_service.dto.GrnItemRequest;
import com.hikkaduwa.milk_shop_service.dto.GrnRequest;
import com.hikkaduwa.milk_shop_service.dto.GrnResponse;
import com.hikkaduwa.milk_shop_service.entity.*;
import com.hikkaduwa.milk_shop_service.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class GrnService {

    private final SupplierRepository supplierRepository;
    private final ItemProductRepository itemProductRepository;
    private final StockLedgerRepository stockLedgerRepository;
    private final PurchaseInvoiceRepository purchaseInvoiceRepository;
    private final PurchaseInvoiceItemRepository purchaseInvoiceItemRepository;

    @Transactional
    public GrnResponse createGrn(GrnRequest request) {

        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (GrnItemRequest itemRequest : request.getItems()) {
            BigDecimal lineTotal = itemRequest.getUnitPrice()
                    .multiply(BigDecimal.valueOf(itemRequest.getQty()));

            totalAmount = totalAmount.add(lineTotal);
        }

        PurchaseInvoice purchaseInvoice = PurchaseInvoice.builder()
                .supplier(supplier)
                .totalAmount(totalAmount)
                .invoiceDate(LocalDate.now())
                .createdAt(LocalDateTime.now())
                .build();

        PurchaseInvoice savedInvoice = purchaseInvoiceRepository.save(purchaseInvoice);

        for (GrnItemRequest itemRequest : request.getItems()) {

            ItemProduct item = itemProductRepository.findById(itemRequest.getItemId())
                    .orElseThrow(() -> new RuntimeException("Item not found"));

            BigDecimal lineTotal = itemRequest.getUnitPrice()
                    .multiply(BigDecimal.valueOf(itemRequest.getQty()));

            PurchaseInvoiceItem invoiceItem = PurchaseInvoiceItem.builder()
                    .purchaseInvoice(savedInvoice)
                    .item(item)
                    .quantity(itemRequest.getQty())
                    .unitPrice(itemRequest.getUnitPrice())
                    .lineTotal(lineTotal)
                    .build();

            purchaseInvoiceItemRepository.save(invoiceItem);

            StockLedger stockLedger = stockLedgerRepository.findByItemId(item.getId())
                    .orElseGet(() -> StockLedger.builder()
                            .item(item)
                            .currentQty(0)
                            .lastUpdated(LocalDateTime.now())
                            .build());

            stockLedger.setCurrentQty(stockLedger.getCurrentQty() + itemRequest.getQty());
            stockLedger.setLastUpdated(LocalDateTime.now());

            stockLedgerRepository.save(stockLedger);
        }

        return GrnResponse.builder()
                .grnId(savedInvoice.getId())
                .supplierName(supplier.getName())
                .totalAmount(savedInvoice.getTotalAmount())
                .message("GRN created successfully and stock updated")
                .build();
    }
}