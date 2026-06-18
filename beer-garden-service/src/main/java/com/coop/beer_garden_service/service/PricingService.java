package com.coop.beer_garden_service.service;

import com.coop.beer_garden_service.entity.BeerPriceList;
import com.coop.beer_garden_service.repository.BeerPriceListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PricingService {

    @Autowired
    private BeerPriceListRepository pricingRepository;

    public List<BeerPriceList> getActivePrices() {
        // Call the updated, sorted repository method
        return pricingRepository.findByIsActiveTrueOrderByBeerNameAsc();
    }

    @Transactional
    public BeerPriceList setPrice(String beerName, BigDecimal newUnitPrice) {
        // 1. Find the existing active price and deprecate it
        Optional<BeerPriceList> existingPriceOpt = pricingRepository.findByBeerNameAndIsActiveTrue(beerName);
        if (existingPriceOpt.isPresent()) {
            BeerPriceList existingPrice = existingPriceOpt.get();
            existingPrice.setIsActive(false);
            pricingRepository.save(existingPrice);
        }

        // 2. Insert the new price as the active record
        BeerPriceList newPrice = new BeerPriceList();
        newPrice.setBeerName(beerName);
        newPrice.setUnitPrice(newUnitPrice);
        newPrice.setEffectiveDate(LocalDate.now());
        newPrice.setIsActive(true);

        return pricingRepository.save(newPrice);
    }
}