package com.coop.beer_garden_service.dto;

import lombok.Data; // Lombok dependency eka project eke thiyena bawa confirm karaganna
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class InvoiceRequest {
    private UUID restaurantId;
    private String restaurantOperatorName;
    private List<InvoiceItem> items;
    private BigDecimal commissionPerUnit;
    private String priorityLevel;
    private BigDecimal totalLiquorValue;

    @Data
    public static class InvoiceItem {
        private String beerName;
        private Integer quantity;
        private BigDecimal unitPrice;
    }
}