package com.hikkaduwa.room_section_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "guest_booking", schema = "schema_room_section")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuestBooking {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "guest_name", nullable = false, length = 100)
    private String guestName;

    @Column(name = "nic_passport", nullable = false, length = 50)
    private String nicPassport;

    @Column(name = "check_in", nullable = false)
    private LocalDateTime checkIn;

    @Column(name = "check_out")
    private LocalDateTime checkOut;

    @Column(nullable = false)
    private Integer adults = 1;

    @Column(nullable = false)
    private Integer children = 0;

    @Column(name = "no_of_days")
    private Integer noOfDays;

    @Column(name = "extra_hours")
    private Integer extraHours;

    @Column(name = "extra_hour_charge", precision = 12, scale = 2)
    private BigDecimal extraHourCharge;

    @Column(name = "service_charge_amount", precision = 12, scale = 2)
    private BigDecimal serviceChargeAmount = BigDecimal.ZERO;

    @Column(name = "vat_rate", precision = 5, scale = 2)
    private BigDecimal vatRate;

    @Column(name = "sscl_rate", precision = 5, scale = 2)
    private BigDecimal ssclRate;

    @Column(name = "advance_payment", precision = 10, scale = 2)
    private BigDecimal advancePayment;

    @Column(name = "final_payment_amount", precision = 12, scale = 2)
    private BigDecimal finalPaymentAmount;

    @Column(name = "final_payment_date")
    private LocalDateTime finalPaymentDate;

    @Column(name = "payment_status", length = 20)
    private String paymentStatus;

    @Column(name = "sub_total", nullable = false, precision = 12, scale = 2)
    private BigDecimal subTotal;

    @Column(name = "tax_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal taxAmount;

    @Column(name = "total_due", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalDue;

    @Column(nullable = false, length = 20)
    private String status;
}