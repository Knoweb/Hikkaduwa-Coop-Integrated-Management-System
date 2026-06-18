package com.coop.beer_garden_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@Table(name = "suppliers", schema = "schema_beer_garden")
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String supplierName;
    private String licenseNumber;
    private String territory;
    private String contactDetails;
    private String creditTerms;

    @Column(nullable = false)
    private BigDecimal outstandingBalance = BigDecimal.ZERO;

    private Boolean isActive = true;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}