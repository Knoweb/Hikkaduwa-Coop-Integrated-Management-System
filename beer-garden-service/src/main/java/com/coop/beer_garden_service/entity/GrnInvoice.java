package com.coop.beer_garden_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Table(name = "grn_invoice", schema = "schema_beer_garden")
public class GrnInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID supplierId;

    @Column(nullable = false, length = 100)
    private String invoiceReference;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    private LocalDateTime receivedDate = LocalDateTime.now();

    @Column(nullable = false, length = 20)
    private String paymentMethod; // "CASH" or "CREDIT"

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amountPaid = BigDecimal.ZERO;

    // Read-only field mapped from the database GENERATED ALWAYS AS
    @Column(insertable = false, updatable = false, length = 20)
    private String paymentStatus;


    @OneToMany(mappedBy = "grnInvoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GrnItem> items = new ArrayList<>();
}