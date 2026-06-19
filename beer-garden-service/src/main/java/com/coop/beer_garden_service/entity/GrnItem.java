package com.coop.beer_garden_service.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Data
@Table(name = "grn_item", schema = "schema_beer_garden")
public class GrnItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grn_invoice_id", nullable = false)
    @JsonBackReference
    @ToString.Exclude
    private BeerGardenGrn grnInvoice;

    @Column(nullable = false)
    private UUID beerItemId;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private BigDecimal unitCost;

    @Column(nullable = false)
    private BigDecimal lineTotal;
}