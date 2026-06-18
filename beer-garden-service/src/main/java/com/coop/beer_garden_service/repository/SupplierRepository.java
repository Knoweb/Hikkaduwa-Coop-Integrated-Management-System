package com.coop.beer_garden_service.repository;

import com.coop.beer_garden_service.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SupplierRepository extends JpaRepository<Supplier, UUID> {
    List<Supplier> findByIsActiveTrueOrderBySupplierNameAsc();
}