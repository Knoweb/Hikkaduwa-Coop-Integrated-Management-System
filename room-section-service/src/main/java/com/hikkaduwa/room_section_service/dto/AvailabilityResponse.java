package com.hikkaduwa.room_section_service.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class AvailabilityResponse {

    private UUID roomId;
    private String roomNumber;
    private String roomType;
    private String status;
    private boolean available;
}