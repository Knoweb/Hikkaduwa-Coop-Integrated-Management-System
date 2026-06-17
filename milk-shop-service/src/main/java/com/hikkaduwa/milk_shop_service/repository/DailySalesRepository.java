package com.hikkaduwa.milk_shop_service.repository;

import com.hikkaduwa.milk_shop_service.entity.DailySales;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

public interface DailySalesRepository extends JpaRepository<DailySales, UUID> {

    Optional<DailySales> findBySalesDate(LocalDate salesDate);
}