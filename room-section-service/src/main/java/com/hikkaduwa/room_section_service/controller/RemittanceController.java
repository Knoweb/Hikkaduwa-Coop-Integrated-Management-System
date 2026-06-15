package com.hikkaduwa.room_section_service.controller;

import com.hikkaduwa.room_section_service.dto.RemittanceRequest;
import com.hikkaduwa.room_section_service.dto.RemittanceResponse;
import com.hikkaduwa.room_section_service.entity.DailyRemittance;
import com.hikkaduwa.room_section_service.service.RemittanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms/remittances")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RemittanceController {

    private final RemittanceService remittanceService;

    @PostMapping
    public RemittanceResponse createRemittance(@Valid @RequestBody RemittanceRequest request) {
        return remittanceService.createRemittance(request);
    }

    @GetMapping
    public List<DailyRemittance> getAllRemittances() {
        return remittanceService.getAllRemittances();
    }
}