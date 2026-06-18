package com.coop.beer_garden_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Data
@Table(name = "beer_price_list", schema = "schema_beer_garden")
public class BeerPriceList {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String beerName;
    private BigDecimal unitPrice;
    private LocalDate effectiveDate;

    // This naming must exactly match the findByIsActiveTrue repository method
    private Boolean isActive;
}