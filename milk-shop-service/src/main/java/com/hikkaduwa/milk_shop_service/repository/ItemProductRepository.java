package com.hikkaduwa.milk_shop_service.repository;

import com.hikkaduwa.milk_shop_service.entity.ItemProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ItemProductRepository extends JpaRepository<ItemProduct, UUID> {
}