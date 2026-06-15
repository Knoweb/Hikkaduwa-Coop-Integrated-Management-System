package com.hikkaduwa.milk_shop_service.controller;

import com.hikkaduwa.milk_shop_service.dto.ItemProductRequest;
import com.hikkaduwa.milk_shop_service.entity.ItemProduct;
import com.hikkaduwa.milk_shop_service.service.ItemProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}