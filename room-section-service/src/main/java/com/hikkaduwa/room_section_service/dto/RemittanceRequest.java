package com.hikkaduwa.room_section_service.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class RemittanceRequest {

    @NotNull(message = "Remittance date is required")
    private LocalDate remittanceDate;

    @NotNull(message = "Total collected is required")
    @DecimalMin(value = "0.0", message = "Total collected cannot be negative")
    private BigDecimal totalCollected;

    @NotNull(message = "Receptionist ID is required")
    private UUID receptionistId;
}