package com.hikkaduwa.milk_shop_service.repository;

import com.hikkaduwa.milk_shop_service.entity.PurchaseInvoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PurchaseInvoiceRepository extends JpaRepository<PurchaseInvoice, UUID> {
}