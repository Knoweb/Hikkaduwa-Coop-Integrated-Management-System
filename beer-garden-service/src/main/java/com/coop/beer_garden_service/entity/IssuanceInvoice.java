package com.coop.beer_garden_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data // Meka damma nam Getter/Setter automatic hadenawa
@Table(name = "issuance_invoice", schema = "schema_beer_garden")
public class IssuanceInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID restaurantId;
    private String restaurantOperatorName;
    private BigDecimal totalLiquorValue;
    private BigDecimal commissionTotal;
    private BigDecimal grandTotal;
    private String status;
    private LocalDateTime issuedDate;
    private String priorityLevel;
}