package com.hikkaduwa.milk_shop_service.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Builder
public class DailySalesResponse {

    private UUID id;
    private LocalDate salesDate;
    private BigDecimal totalSalesValue;
    private BigDecimal cashHandedOver;
    private BigDecimal discrepancy;
    private String message;
}