package com.hikkaduwa.milk_shop_service.controller;

import com.hikkaduwa.milk_shop_service.dto.StockAdjustmentRequest;
import com.hikkaduwa.milk_shop_service.dto.StockAdjustmentResponse;
import com.hikkaduwa.milk_shop_service.service.StockAdjustmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/milk-shop/stock-adjustments")
@RequiredArgsConstructor
public class StockAdjustmentController {

    private final StockAdjustmentService stockAdjustmentService;

    @PostMapping
    public StockAdjustmentResponse createStockAdjustment(
            @Valid @RequestBody StockAdjustmentRequest request
    ) {
        return stockAdjustmentService.createStockAdjustment(request);
    }

    @GetMapping
    public List<StockAdjustmentResponse> getAllStockAdjustments() {
        return stockAdjustmentService.getAllStockAdjustments();
    }
}