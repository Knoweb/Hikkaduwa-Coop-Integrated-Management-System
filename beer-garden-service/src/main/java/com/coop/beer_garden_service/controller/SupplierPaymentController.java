package com.coop.beer_garden_service.controller;

import com.coop.beer_garden_service.dto.SupplierPaymentRequest;
import com.coop.beer_garden_service.entity.Supplier;
import com.coop.beer_garden_service.entity.SupplierPayment;
import com.coop.beer_garden_service.repository.SupplierPaymentRepository;
import com.coop.beer_garden_service.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/beer-garden/supplier-payments")
public class SupplierPaymentController {

    @Autowired
    private SupplierRepository supplierRepository;
    @Autowired
    private SupplierPaymentRepository paymentRepository;

    @PostMapping
    @Transactional // Ensures if one step fails, the whole payment rolls back
    public ResponseEntity<SupplierPayment> processPayment(@RequestBody SupplierPaymentRequest request) {
        // 1. Find the Supplier
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        // 2. Reduce their outstanding debt
        supplier.setOutstandingBalance(supplier.getOutstandingBalance().subtract(request.getAmount()));
        supplierRepository.save(supplier);

        // 3. Record the strict audit trail
        SupplierPayment payment = new SupplierPayment();
        payment.setSupplierId(supplier.getId());
        payment.setAmount(request.getAmount());
        payment.setPaymentReference(request.getPaymentReference());

        return ResponseEntity.ok(paymentRepository.save(payment));
    }
}