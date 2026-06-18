package com.coop.beer_garden_service.controller;

import com.coop.beer_garden_service.dto.GrnRequest;
import com.coop.beer_garden_service.entity.GrnInvoice;
import com.coop.beer_garden_service.service.GrnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/beer-garden/grn")
public class GrnController {

    @Autowired
    private GrnService grnService;

    @PostMapping
    public ResponseEntity<GrnInvoice> createGrn(@RequestBody GrnRequest request) {
        // FIXED: Calling the updated method name 'processProcurement'
        return ResponseEntity.ok(grnService.processProcurement(request));
    }
}