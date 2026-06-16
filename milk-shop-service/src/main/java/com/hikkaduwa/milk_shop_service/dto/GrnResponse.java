package com.hikkaduwa.milk_shop_service.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Builder
public class GrnResponse {

    private UUID grnId;
    private String supplierName;
    private BigDecimal totalAmount;
    private String message;
}