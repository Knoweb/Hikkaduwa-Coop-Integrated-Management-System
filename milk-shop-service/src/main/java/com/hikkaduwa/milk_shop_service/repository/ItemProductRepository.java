package com.hikkaduwa.milk_shop_service.repository;

import com.hikkaduwa.milk_shop_service.entity.ItemProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ItemProductRepository extends JpaRepository<ItemProduct, UUID> {

    List<ItemProduct> findByIsActiveTrue();

    @Query("""
           SELECT i
           FROM ItemProduct i
           JOIN StockLedger s ON s.item = i
           WHERE i.isActive = true
           AND s.currentQty <= i.reorderLevel
           """)
    List<ItemProduct> findLowStockItems();
}