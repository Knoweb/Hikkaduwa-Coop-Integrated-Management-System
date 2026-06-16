package com.hikkaduwa.milk_shop_service.service;

import com.hikkaduwa.milk_shop_service.dto.DailySalesRequest;
import com.hikkaduwa.milk_shop_service.dto.DailySalesResponse;
import com.hikkaduwa.milk_shop_service.entity.DailySales;
import com.hikkaduwa.milk_shop_service.repository.DailySalesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DailySalesService {

    private final DailySalesRepository dailySalesRepository;

    public DailySalesResponse createDailySales(DailySalesRequest request) {

        dailySalesRepository.findBySalesDate(request.getSalesDate())
                .ifPresent(existing -> {
                    throw new RuntimeException("Daily sales already recorded for this date");
                });

        BigDecimal discrepancy = request.getCashHandedOver()
                .subtract(request.getTotalSalesValue());

        DailySales dailySales = DailySales.builder()
                .salesDate(request.getSalesDate())
                .totalSalesValue(request.getTotalSalesValue())
                .cashHandedOver(request.getCashHandedOver())
                .discrepancy(discrepancy)
                .operatorId(request.getOperatorId())
                .createdAt(LocalDateTime.now())
                .build();

        DailySales saved = dailySalesRepository.save(dailySales);

        return DailySalesResponse.builder()
                .id(saved.getId())
                .salesDate(saved.getSalesDate())
                .totalSalesValue(saved.getTotalSalesValue())
                .cashHandedOver(saved.getCashHandedOver())
                .discrepancy(saved.getDiscrepancy())
                .message("Daily sales saved successfully")
                .build();
    }

    public List<DailySales> getAllDailySales() {
        return dailySalesRepository.findAll();
    }
}