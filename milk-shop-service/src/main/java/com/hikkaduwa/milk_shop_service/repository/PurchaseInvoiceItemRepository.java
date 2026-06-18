package com.hikkaduwa.milk_shop_service.repository;

import com.hikkaduwa.milk_shop_service.entity.PurchaseInvoice;
import com.hikkaduwa.milk_shop_service.entity.PurchaseInvoiceItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PurchaseInvoiceItemRepository extends JpaRepository<PurchaseInvoiceItem, UUID> {

    List<PurchaseInvoiceItem> findByPurchaseInvoice(PurchaseInvoice purchaseInvoice);
}