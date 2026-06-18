package com.hikkaduwa.milk_shop_service.repository;

import com.hikkaduwa.milk_shop_service.entity.StockAdjustmentLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface StockAdjustmentLogRepository
        extends JpaRepository<StockAdjustmentLog, UUID> {

    List<StockAdjustmentLog> findAllByOrderByAdjustmentDateDescCreatedAtDesc();
}