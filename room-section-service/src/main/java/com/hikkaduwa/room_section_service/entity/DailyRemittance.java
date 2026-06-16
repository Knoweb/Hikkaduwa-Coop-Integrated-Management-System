package com.hikkaduwa.room_section_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "daily_remittance", schema = "schema_room_section")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyRemittance {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "remittance_date", nullable = false, unique = true)
    private LocalDate remittanceDate;

    @Column(name = "total_collected", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalCollected;

    @Column(name = "receptionist_id", nullable = false)
    private UUID receptionistId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}