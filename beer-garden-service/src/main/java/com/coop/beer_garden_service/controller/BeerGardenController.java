package com.coop.beer_garden_service.controller;

import com.coop.beer_garden_service.dto.InvoiceRequest;
import com.coop.beer_garden_service.dto.InvoiceResponse;
import com.coop.beer_garden_service.dto.PaymentRequest;
import com.coop.beer_garden_service.dto.PaymentResponse;
import com.coop.beer_garden_service.entity.IssuanceInvoice;
import com.coop.beer_garden_service.service.BeerGardenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/beer-garden")
public class BeerGardenController {

    @Autowired
    private BeerGardenService beerGardenService;

    @PostMapping("/issuances")
    public ResponseEntity<IssuanceInvoice> createIssuance(@RequestBody InvoiceRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (request.getCommissionPerUnit() == null) {
            request.setCommissionPerUnit(new BigDecimal("50.00"));
        }

        IssuanceInvoice savedIssuance = beerGardenService.createIssuance(request);
        return ResponseEntity.ok(savedIssuance);
    }

    @GetMapping("/invoices")
    public ResponseEntity<List<InvoiceResponse>> getAllInvoices() {
        return ResponseEntity.ok(beerGardenService.getReceivables());
    }

    @PostMapping("/invoices/{id}/payments")
    public ResponseEntity<String> addPayment(
            @PathVariable UUID id,
            @RequestBody PaymentRequest request) {

        beerGardenService.processPayment(id, request);

        return ResponseEntity.ok("Payment recorded and status updated successfully.");
    }

    @PutMapping("/invoices/{id}/priority")
    public ResponseEntity<String> updatePriority(
            @PathVariable UUID id,
            @RequestBody java.util.Map<String, String> request) {

        beerGardenService.updatePriority(id, request.get("priorityLevel"));
        return ResponseEntity.ok("Priority updated successfully.");
    }

    @GetMapping("/payments")
    public ResponseEntity<List<PaymentResponse>> getPaymentHistory() {
        return ResponseEntity.ok(beerGardenService.getPaymentHistory());
    }
    @PostMapping("/grn")
    public ResponseEntity<com.coop.beer_garden_service.entity.BeerGardenGrn> createGrn(
            @RequestBody com.coop.beer_garden_service.dto.GrnRequest request) {
        return ResponseEntity.ok(beerGardenService.createGrn(request));
    }

    @GetMapping("/grn-history")
    public ResponseEntity<List<com.coop.beer_garden_service.entity.BeerGardenGrn>> getGrnHistory() {
        return ResponseEntity.ok(beerGardenService.getGrnHistory());
    }
    @GetMapping("/purchase-history")
    public ResponseEntity<List<java.util.Map<String, Object>>> getDetailedPurchaseHistory() {
        return ResponseEntity.ok(beerGardenService.getDetailedPurchaseHistory());
    }

    @PostMapping("/supplier-payments")
    public ResponseEntity<String> processSupplierPayment(@RequestBody com.coop.beer_garden_service.dto.SupplierPaymentRequest request) {
        beerGardenService.processSupplierPayment(request);
        return ResponseEntity.ok("Payment processed successfully");
    }

    @GetMapping("/suppliers/{id}/unpaid-grns")
    public ResponseEntity<List<com.coop.beer_garden_service.entity.BeerGardenGrn>> getUnpaidGrnsBySupplier(@PathVariable java.util.UUID id) {
        return ResponseEntity.ok(beerGardenService.getUnpaidGrnsBySupplier(id));
    }

    @GetMapping("/receivables")
    public ResponseEntity<List<InvoiceResponse>> getReceivables(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(beerGardenService.getReceivables());
    }

}