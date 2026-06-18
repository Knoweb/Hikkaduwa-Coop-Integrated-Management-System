package com.coop.beer_garden_service.repository;

import com.coop.beer_garden_service.entity.GrnInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface GrnInvoiceRepository extends JpaRepository<GrnInvoice, UUID> {
}