package com.hikkaduwa.room_section_service.controller;

import com.hikkaduwa.room_section_service.dto.RoomBillingSettingRequest;
import com.hikkaduwa.room_section_service.entity.RoomBillingSetting;
import com.hikkaduwa.room_section_service.service.RoomBillingSettingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/rooms/billing-settings")
@RequiredArgsConstructor
public class RoomBillingSettingController {

    private final RoomBillingSettingService roomBillingSettingService;

    @GetMapping
    public RoomBillingSetting getBillingSetting() {
        return roomBillingSettingService.getBillingSetting();
    }

    @PutMapping
    public RoomBillingSetting updateBillingSetting(
            @Valid @RequestBody RoomBillingSettingRequest request
    ) {
        return roomBillingSettingService.updateBillingSetting(request);
    }
}