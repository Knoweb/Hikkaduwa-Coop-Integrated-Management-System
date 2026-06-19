package com.coop.beer_garden_service.controller;

import com.coop.beer_garden_service.entity.BeerItem;
import com.coop.beer_garden_service.entity.IssuanceInvoice;
import com.coop.beer_garden_service.entity.IssuanceItem;
import com.coop.beer_garden_service.repository.BeerItemRepository;
import com.coop.beer_garden_service.repository.IssuanceInvoiceRepository;
import com.coop.beer_garden_service.repository.IssuanceItemRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/beer-garden/issuance")
public class IssuanceController {

    @Autowired
    private IssuanceInvoiceRepository invoiceRepo;
    @Autowired
    private IssuanceItemRepository itemRepo;
    @Autowired
    private BeerItemRepository catalogRepo;

    @PostMapping
    @Transactional
    public ResponseEntity<IssuanceInvoice> createIssuance(
            @RequestBody IssuanceRequest request,
            @RequestHeader(value = "X-User-Role", defaultValue = "ROLE_USER") String userRole) {

        IssuanceInvoice invoice = new IssuanceInvoice();
        invoice.setInvoiceNumber("INV-" + System.currentTimeMillis() % 1000000000);
        invoice.setOperatorName(request.getOperatorName());
        invoice.setIssuedByRole(userRole);

        BigDecimal totalStockValue = BigDecimal.ZERO;
        BigDecimal totalCommission = BigDecimal.ZERO;

        invoice = invoiceRepo.save(invoice);

        for (IssuanceItemRequest reqItem : request.getItems()) {
            BeerItem catalogItem = catalogRepo.findById(reqItem.getBeerItemId())
                    .orElseThrow(() -> new RuntimeException("Beer item not found"));

            if (catalogItem.getCurrentStock() < reqItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + catalogItem.getBeerName());
            }

            catalogItem.setCurrentStock(catalogItem.getCurrentStock() - reqItem.getQuantity());
            catalogRepo.save(catalogItem);

            BigDecimal qty = new BigDecimal(reqItem.getQuantity());
            BigDecimal stockValue = catalogItem.getUnitPrice().multiply(qty);
            BigDecimal commValue = reqItem.getCommissionPerBottle().multiply(qty);

            totalStockValue = totalStockValue.add(stockValue);
            totalCommission = totalCommission.add(commValue);

            IssuanceItem lineItem = new IssuanceItem();
            lineItem.setInvoiceId(invoice.getId());
            lineItem.setBeerItemId(catalogItem.getId());
            lineItem.setQuantity(reqItem.getQuantity());
            lineItem.setUnitPrice(catalogItem.getUnitPrice()); // Snapshot
            lineItem.setCommissionPerBottle(reqItem.getCommissionPerBottle());
            lineItem.setLineTotal(stockValue.add(commValue));
            itemRepo.save(lineItem);
        }

        invoice.setTotalStockValue(totalStockValue);
        invoice.setTotalCommission(totalCommission);
        invoice.setGrandTotal(totalStockValue.add(totalCommission));

        return ResponseEntity.ok(invoiceRepo.save(invoice));
    }

    @Data
    public static class IssuanceRequest {
        private String operatorName;
        private List<IssuanceItemRequest> items;
    }

    @Data
    public static class IssuanceItemRequest {
        private UUID beerItemId;
        private Integer quantity;
        private BigDecimal commissionPerBottle;
    }
}