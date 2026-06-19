package com.coop.beer_garden_service.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentResponse {
    private String invoiceNumber;
    private String operatorName;
    private BigDecimal amountPaid;
    private String paymentMethod;
    private String chequeRef;
    private LocalDateTime paymentDate;
}