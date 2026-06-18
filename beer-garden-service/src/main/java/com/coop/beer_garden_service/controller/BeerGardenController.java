package com.coop.beer_garden_service.controller;

import com.coop.beer_garden_service.entity.IssuanceInvoice;
import com.coop.beer_garden_service.service.BeerGardenService;
import com.coop.beer_garden_service.dto.InvoiceRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal; // <--- YOU MUST ADD THIS LINE
import java.util.List;

@RestController
@RequestMapping("/api/v1/beer-garden")
public class BeerGardenController {

    @Autowired
    private BeerGardenService beerGardenService;

    @PostMapping("/invoices")
    public ResponseEntity<IssuanceInvoice> createInvoice(@RequestBody InvoiceRequest request) {
        if (request.getCommissionPerUnit() == null) {
            request.setCommissionPerUnit(new BigDecimal("50.00"));
        }

        IssuanceInvoice newInvoice = beerGardenService.createInvoice(request);
        return ResponseEntity.ok(newInvoice);
    }

    @GetMapping("/receivables")
    public ResponseEntity<List<IssuanceInvoice>> getReceivables(
            @RequestParam(required = false, defaultValue = "UNPAID") String status) {

        List<IssuanceInvoice> invoices = beerGardenService.getReceivables(status);
        return ResponseEntity.ok(invoices);
    }

    @PostMapping("/issuances")
    public ResponseEntity<IssuanceInvoice> createIssuance(@RequestBody InvoiceRequest request) {
        // 1. Validate mandatory fields
        if (request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // 2. Set defaults if missing
        if (request.getCommissionPerUnit() == null) {
            request.setCommissionPerUnit(new BigDecimal("50.00"));
        }

        // 3. Process the issuance
        IssuanceInvoice savedIssuance = beerGardenService.createIssuance(request);

        return ResponseEntity.ok(savedIssuance);
    }
}