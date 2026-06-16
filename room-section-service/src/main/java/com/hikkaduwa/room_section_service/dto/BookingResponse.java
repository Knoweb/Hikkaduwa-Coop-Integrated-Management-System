package com.hikkaduwa.room_section_service.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class BookingResponse {

    private UUID bookingId;
    private String roomNumber;
    private String guestName;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private long noOfDays;
    private BigDecimal subTotal;
    private BigDecimal taxAmount;
    private BigDecimal totalDue;
    private BigDecimal advancePayment;
    private BigDecimal balanceDue;
    private String status;
    private String message;
}