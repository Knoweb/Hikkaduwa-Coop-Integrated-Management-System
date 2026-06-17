package com.hikkaduwa.milk_shop_service.controller;

import com.hikkaduwa.milk_shop_service.dto.ItemProductRequest;
import com.hikkaduwa.milk_shop_service.entity.ItemProduct;
import com.hikkaduwa.milk_shop_service.service.ItemProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/milk-shop/items")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ItemProductController {

    private final ItemProductService itemProductService;

    @GetMapping
    public List<ItemProduct> getAllItems() {
        return itemProductService.getAllItems();
    }

    @PostMapping
    public ItemProduct createItem(@Valid @RequestBody ItemProductRequest request) {
        return itemProductService.createItem(request);
    }

    @PutMapping("/{id}")
    public ItemProduct updateItem(
            @PathVariable UUID id,
            @Valid @RequestBody ItemProductRequest request
    ) {
        return itemProductService.updateItem(id, request);
    }

    @GetMapping("/low-stock")
    public List<ItemProduct> getLowStockItems() {
        return itemProductService.getLowStockItems();
    }
}