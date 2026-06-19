package com.coop.beer_garden_service.controller;

import com.coop.beer_garden_service.entity.BeerItem;
import com.coop.beer_garden_service.entity.BeerPriceList;
import com.coop.beer_garden_service.repository.BeerItemRepository;
import com.coop.beer_garden_service.repository.BeerPriceListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/beer-garden/items")
public class BeerItemController {

    @Autowired
    private BeerItemRepository beerItemRepository;

    @Autowired
    private BeerPriceListRepository priceHistoryRepository;

    @GetMapping
    public ResponseEntity<List<BeerItem>> getAllItems() {
        return ResponseEntity.ok(beerItemRepository.findAll());
    }

    @PutMapping("/{id}/price")
    @Transactional
    public ResponseEntity<BeerItem> updatePrice(
            @PathVariable UUID id,
            @RequestBody Map<String, BigDecimal> payload,
            @RequestHeader(value = "X-User-Role", defaultValue = "ROLE_USER") String userRole) {

        if (!"ROLE_ADMIN".equals(userRole)) {
            throw new RuntimeException("Unauthorized: Only Admins can authorize price changes.");
        }

        BeerItem item = beerItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        BigDecimal newPrice = payload.get("newPrice");

        BeerPriceList history = new BeerPriceList();
        history.setBeerItemId(item.getId());
        history.setUnitPrice(newPrice);
        history.setAuthorizedBy(userRole);
        priceHistoryRepository.save(history);

        item.setUnitPrice(newPrice);
        return ResponseEntity.ok(beerItemRepository.save(item));
    }

    @PostMapping
    public ResponseEntity<BeerItem> addBeerItem(@RequestBody BeerItem newItem) {
        if (newItem.getItemCode() == null || newItem.getItemCode().isEmpty()) {
            newItem.setItemCode("SKU-" + System.currentTimeMillis());
        }
        if (newItem.getCategory() == null || newItem.getCategory().isEmpty()) {
            newItem.setCategory("Uncategorized");
        }
        return ResponseEntity.ok(beerItemRepository.save(newItem));
    }
}