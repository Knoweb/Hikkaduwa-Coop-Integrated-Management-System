package com.coop.beer_garden_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@Table(name = "supplier_payments", schema = "schema_beer_garden")
public class SupplierPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID supplierId;

    private UUID grnInvoiceId; // Nullable if it's a general payment against the total balance

    private LocalDateTime paymentDate = LocalDateTime.now();

    @Column(nullable = false)
    private BigDecimal amount;

    private String paymentReference; // e.g., "Cheque No: 12345"
}