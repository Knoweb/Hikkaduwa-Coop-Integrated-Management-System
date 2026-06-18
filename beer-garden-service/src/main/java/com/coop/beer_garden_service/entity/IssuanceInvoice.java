package com.coop.beer_garden_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data // මේකෙන් @Setter සහ @Getter ඔක්කොම auto හදනවා
@Table(name = "issuance_invoice", schema = "schema_beer_garden")
public class IssuanceInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 50)
    private String invoiceNumber;

    @Column(nullable = false, length = 150)
    private String operatorName; // අපි කලින් 'RestaurantOperatorName' වෙනුවට කෙටියෙන් මේක පාවිච්චි කරමු

    private LocalDateTime issuedDate = LocalDateTime.now();

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalStockValue = BigDecimal.ZERO; // 'TotalLiquorValue' වෙනුවට

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalCommission = BigDecimal.ZERO; // 'CommissionTotal' වෙනුවට

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal grandTotal = BigDecimal.ZERO;

    @Column(nullable = false)
    private String issuedByRole;
}