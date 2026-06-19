package com.coop.beer_garden_service.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "beer_garden_grn")
public class BeerGardenGrn {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "grn_number")
    private String grnNumber;

    @Column(name = "supplier_name")
    private String supplierName;

    @Column(name = "received_date")
    private LocalDateTime receivedDate;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "amount_paid")
    private BigDecimal amountPaid;

    @Column(name = "status")
    private String status;

    @OneToMany(mappedBy = "grnInvoice", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @ToString.Exclude
    private List<GrnItem> items = new ArrayList<>();
}