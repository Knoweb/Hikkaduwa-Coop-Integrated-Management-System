package com.hikkaduwa.milk_shop_service.repository;

import com.hikkaduwa.milk_shop_service.entity.PurchaseInvoiceItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PurchaseInvoiceItemRepository extends JpaRepository<PurchaseInvoiceItem, UUID> {
}