package com.hikkaduwa.room_section_service.controller;

import com.hikkaduwa.room_section_service.dto.RemittanceRequest;
import com.hikkaduwa.room_section_service.dto.RemittanceResponse;
import com.hikkaduwa.room_section_service.service.RemittanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
public class RemittanceController {

    private final RemittanceService remittanceService;

    @PostMapping("/remittances")
    public RemittanceResponse createRemittance(
            @Valid @RequestBody RemittanceRequest request
    ) {
        return remittanceService.createRemittance(request);
    }

    @GetMapping("/remittances")
    public List<RemittanceResponse> getAllRemittances() {
        return remittanceService.getAllRemittances();
    }
}