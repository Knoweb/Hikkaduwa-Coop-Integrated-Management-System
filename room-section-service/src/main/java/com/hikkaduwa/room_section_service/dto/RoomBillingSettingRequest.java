package com.hikkaduwa.room_section_service.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class RoomBillingSettingRequest {

    @NotNull(message = "VAT rate is required")
    @DecimalMin(value = "0.0", message = "VAT rate cannot be negative")
    private BigDecimal vatRate;

    @NotNull(message = "SSCL rate is required")
    @DecimalMin(value = "0.0", message = "SSCL rate cannot be negative")
    private BigDecimal ssclRate;
}