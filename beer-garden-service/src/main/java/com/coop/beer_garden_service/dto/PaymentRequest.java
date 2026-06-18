package com.coop.beer_garden_service.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class PaymentRequest {
    private UUID invoiceId;
    private BigDecimal amountPaid;
    private String paymentMethod; // CASH, CHEQUE
    private String chequeRef; // Reference number[cite: 1]
}