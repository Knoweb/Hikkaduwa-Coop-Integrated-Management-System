package com.coop.beer_garden_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payment_record", schema = "schema_beer_garden")
@Data
public class PaymentRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "invoice_id", nullable = false)
    private IssuanceInvoice invoice;

    @Column(name = "amount_paid", nullable = false)
    private BigDecimal amountPaid;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @Column(name = "cheque_ref")
    private String chequeRef;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate = LocalDateTime.now();
}