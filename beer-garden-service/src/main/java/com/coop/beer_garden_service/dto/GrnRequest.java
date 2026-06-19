package com.coop.beer_garden_service.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class GrnRequest {
    private UUID supplierId;
    private String invoiceReference;
    private String paymentMethod;
    private BigDecimal amountPaid;
    private List<GrnItemRequest> items;

    @Data
    public static class GrnItemRequest {
        private UUID beerItemId;
        private Integer quantity;
        private BigDecimal unitCost;
    }
}