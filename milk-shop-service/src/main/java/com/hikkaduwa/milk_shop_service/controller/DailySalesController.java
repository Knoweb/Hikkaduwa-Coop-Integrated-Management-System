package com.hikkaduwa.milk_shop_service.controller;

import com.hikkaduwa.milk_shop_service.dto.DailySalesRequest;
import com.hikkaduwa.milk_shop_service.dto.DailySalesResponse;
import com.hikkaduwa.milk_shop_service.service.DailySalesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/milk-shop/sales")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DailySalesController {

    private final DailySalesService dailySalesService;

    @PostMapping("/daily-summary")
    public DailySalesResponse createDailySales(
            @Valid @RequestBody DailySalesRequest request
    ) {
        return dailySalesService.createDailySales(request);
    }

    @GetMapping
    public List<DailySalesResponse> getAllDailySales() {
        return dailySalesService.getAllDailySales();
    }
}