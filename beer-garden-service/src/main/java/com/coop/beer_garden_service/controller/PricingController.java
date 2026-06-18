package com.coop.beer_garden_service.controller;

import com.coop.beer_garden_service.entity.BeerPriceList;
import lombok.Data;
import com.coop.beer_garden_service.service.PricingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // Import this
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/beer-garden/prices")
public class PricingController {

    @Autowired
    private PricingService pricingService;

    @GetMapping
    public ResponseEntity<List<BeerPriceList>> getActivePrices() {
        return ResponseEntity.ok(pricingService.getActivePrices());
    }

    // MEKA ADMIN TA WITHARAI PULUWAN
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<BeerPriceList> updatePrice(@RequestBody PriceUpdateRequest request) {
        BeerPriceList updated = pricingService.setPrice(request.getBeerName(), request.getUnitPrice());
        return ResponseEntity.ok(updated);
    }

    @Data
    public static class PriceUpdateRequest {
        private String beerName;
        private BigDecimal unitPrice;
    }
}