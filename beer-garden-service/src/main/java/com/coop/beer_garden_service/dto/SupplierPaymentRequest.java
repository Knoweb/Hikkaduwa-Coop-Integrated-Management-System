package com.coop.beer_garden_service.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class SupplierPaymentRequest {
    private UUID supplierId;
    private UUID grnId;
    private BigDecimal amount;
    private String paymentReference;
}