package com.hikkaduwa.room_section_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "room_billing_setting", schema = "schema_room_section")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomBillingSetting {

    @Id
    private Integer id;

    @Column(name = "vat_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal vatRate;

    @Column(name = "sscl_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal ssclRate;
}