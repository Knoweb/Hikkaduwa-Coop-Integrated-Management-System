package com.hikkaduwa.room_section_service.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Builder
public class RemittanceResponse {

    private UUID remittanceId;
    private LocalDate remittanceDate;
    private BigDecimal totalCollected;
    private BigDecimal expectedInvoiceTotal;
    private BigDecimal discrepancy;
    private String message;
}