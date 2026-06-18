package com.coop.beer_garden_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Data
@Table(name = "beer_items", schema = "schema_beer_garden")
public class BeerItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String itemCode;

    @Column(nullable = false)
    private String beerName;

    private String category;

    @Column(nullable = false)
    private Integer currentStock = 0;

    private BigDecimal unitPrice;
}