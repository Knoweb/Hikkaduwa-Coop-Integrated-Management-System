package com.hikkaduwa.milk_shop_service.controller;

import com.hikkaduwa.milk_shop_service.dto.GrnRequest;
import com.hikkaduwa.milk_shop_service.dto.GrnResponse;
import com.hikkaduwa.milk_shop_service.service.GrnService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/milk-shop/grn")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GrnController {

    private final GrnService grnService;

    @PostMapping
    public GrnResponse createGrn(@Valid @RequestBody GrnRequest request) {
        return grnService.createGrn(request);
    }
}