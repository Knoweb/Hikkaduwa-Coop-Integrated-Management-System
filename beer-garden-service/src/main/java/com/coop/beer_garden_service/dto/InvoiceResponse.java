package com.coop.beer_garden_service.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class InvoiceResponse {
    private UUID id;
    private String invoiceNumber;
    private String operatorName;
    private LocalDateTime issuedDate;
    private BigDecimal grandTotal;
    private String status;
    private String priorityLevel;
    private BigDecimal balanceDue;

    private long daysOutstanding;
    private boolean isOverdue;

    private BigDecimal totalStockValue;
    private BigDecimal totalCommission;
}