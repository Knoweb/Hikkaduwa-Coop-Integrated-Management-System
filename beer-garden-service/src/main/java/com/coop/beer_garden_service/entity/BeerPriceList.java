package com.coop.beer_garden_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@Table(name = "beer_price_list", schema = "schema_beer_garden")
public class BeerPriceList {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID beerItemId;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    private LocalDateTime effectiveDate = LocalDateTime.now();

    @Column(nullable = false)
    private String authorizedBy;;
}