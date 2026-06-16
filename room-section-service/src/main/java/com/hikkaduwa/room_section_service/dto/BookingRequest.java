package com.hikkaduwa.room_section_service.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class BookingRequest {

    @NotNull(message = "Room ID is required")
    private UUID roomId;

    @NotBlank(message = "Guest name is required")
    private String guestName;

    @NotBlank(message = "NIC or passport is required")
    private String nicPassport;

    @NotNull(message = "Check-in date/time is required")
    private LocalDateTime checkIn;

    @NotNull(message = "Check-out date/time is required")
    private LocalDateTime checkOut;

    @DecimalMin(value = "0.0", message = "Advance payment cannot be negative")
    private BigDecimal advancePayment = BigDecimal.ZERO;
}