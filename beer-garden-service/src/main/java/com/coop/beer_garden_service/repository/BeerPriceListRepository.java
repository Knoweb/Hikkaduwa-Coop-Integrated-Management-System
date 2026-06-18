package com.coop.beer_garden_service.repository;

import com.coop.beer_garden_service.entity.BeerPriceList;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;
import java.util.UUID;

public interface BeerPriceListRepository extends JpaRepository<BeerPriceList, UUID> {
    List<BeerPriceList> findByIsActiveTrueOrderByBeerNameAsc();
    Optional<BeerPriceList> findByBeerNameAndIsActiveTrue(String beerName);
}