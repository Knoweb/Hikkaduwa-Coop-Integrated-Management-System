package com.coop.beer_garden_service.controller;

import com.coop.beer_garden_service.dto.SupplierRequest;
import com.coop.beer_garden_service.entity.Supplier;
import com.coop.beer_garden_service.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/beer-garden/suppliers")
public class SupplierController {

    @Autowired
    private SupplierRepository supplierRepository;

    @GetMapping
    public ResponseEntity<List<Supplier>> getAllSuppliers() {
        return ResponseEntity.ok(supplierRepository.findByIsActiveTrueOrderBySupplierNameAsc());
    }

    @PostMapping
    public ResponseEntity<Supplier> addSupplier(@RequestBody SupplierRequest request) {
        Supplier supplier = new Supplier();
        supplier.setSupplierName(request.getSupplierName());
        supplier.setLicenseNumber(request.getLicenseNumber());
        supplier.setTerritory(request.getTerritory());
        supplier.setContactDetails(request.getContactDetails());
        supplier.setCreditTerms(request.getCreditTerms());

        return ResponseEntity.ok(supplierRepository.save(supplier));
    }
}