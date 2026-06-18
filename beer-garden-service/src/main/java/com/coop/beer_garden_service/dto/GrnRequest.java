package com.coop.beer_garden_service.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class GrnRequest {
    private UUID supplierId;
    private String invoiceReference;
    private String paymentMethod; // "CASH" or "CREDIT"
    private BigDecimal amountPaid; // Useful if partial payment happens
    private List<GrnItemRequest> items;

    @Data
    public static class GrnItemRequest {
        private UUID beerItemId; // Changed from beerName
        private Integer quantity;
        private BigDecimal unitCost;
    }
}