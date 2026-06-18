package com.coop.beer_garden_service.controller;

import com.coop.beer_garden_service.entity.IssuanceInvoice;
import com.coop.beer_garden_service.service.BeerGardenService;
import com.coop.beer_garden_service.dto.InvoiceRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/beer-garden")
public class BeerGardenController {

    @Autowired
    private BeerGardenService beerGardenService;

    // Use this for the restaurant issuance feature
    @PostMapping("/issuances")
    public ResponseEntity<IssuanceInvoice> createIssuance(@RequestBody InvoiceRequest request) {
        // 1. Validate mandatory fields
        if (request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // 2. Set default commission if not provided
        if (request.getCommissionPerUnit() == null) {
            request.setCommissionPerUnit(new BigDecimal("50.00"));
        }

        // 3. Process the issuance through the service
        IssuanceInvoice savedIssuance = beerGardenService.createIssuance(request);

        return ResponseEntity.ok(savedIssuance);
    }

    @GetMapping("/invoices")
    public ResponseEntity<List<IssuanceInvoice>> getAllInvoices() {
        return ResponseEntity.ok(beerGardenService.getReceivables()); // Parameter නැතුව
    }
}