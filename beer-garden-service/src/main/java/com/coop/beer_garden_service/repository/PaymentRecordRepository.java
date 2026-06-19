package com.coop.beer_garden_service.repository;

import com.coop.beer_garden_service.entity.PaymentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.UUID;

public interface PaymentRecordRepository extends JpaRepository<PaymentRecord, UUID> {
    @Query("SELECT SUM(p.amountPaid) FROM PaymentRecord p WHERE p.invoice.id = :invoiceId")
    BigDecimal sumPaymentsByInvoice(@Param("invoiceId") UUID invoiceId);
}