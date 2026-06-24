package com.hikkaduwa.milk_shop_service.controller;

import com.hikkaduwa.milk_shop_service.dto.StockReduceRequest;
import com.hikkaduwa.milk_shop_service.dto.StockReduceResponse;
import com.hikkaduwa.milk_shop_service.entity.StockLedger;
import com.hikkaduwa.milk_shop_service.service.StockLedgerService;
import com.hikkaduwa.milk_shop_service.dto.StockAdjustRequest;
import com.hikkaduwa.milk_shop_service.dto.StockAdjustResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/milk-shop/stock")
@RequiredArgsConstructor
public class StockLedgerController {

    private final StockLedgerService stockLedgerService;

    @GetMapping
    public List<StockLedger> getAllStock() {
        return stockLedgerService.getAllStock();
    }

    @GetMapping("/alerts")
    public List<StockLedger> getLowStockAlerts() {
        return stockLedgerService.getLowStockItems();
    }

    @GetMapping("/out-of-stock")
    public List<StockLedger> getOutOfStockItems() {
        return stockLedgerService.getOutOfStockItems();
    }

    @PatchMapping("/reduce")
    public StockReduceResponse reduceStock(
            @Valid @RequestBody StockReduceRequest request
    ) {
        return stockLedgerService.reduceStock(request);
    }

    @PatchMapping("/adjust")
    public StockAdjustResponse adjustStock(
            @Valid @RequestBody StockAdjustRequest request
    ) {
        return stockLedgerService.adjustStockToActualQuantity(request);
    }
}