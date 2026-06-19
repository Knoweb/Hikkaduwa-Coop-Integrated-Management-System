package com.coop.beer_garden_service.repository;

import com.coop.beer_garden_service.entity.IssuanceInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IssuanceInvoiceRepository extends JpaRepository<IssuanceInvoice, UUID> {

}