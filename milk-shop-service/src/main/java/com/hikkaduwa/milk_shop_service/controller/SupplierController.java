package com.hikkaduwa.milk_shop_service.controller;

import com.hikkaduwa.milk_shop_service.dto.SupplierRequest;
import com.hikkaduwa.milk_shop_service.entity.Supplier;
import com.hikkaduwa.milk_shop_service.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/milk-shop/suppliers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierService.getAllActiveSuppliers();
    }

    @PostMapping
    public Supplier createSupplier(@Valid @RequestBody SupplierRequest request) {
        return supplierService.createSupplier(request);
    }
}