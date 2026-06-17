package com.hikkaduwa.room_section_service.repository;

import com.hikkaduwa.room_section_service.entity.GuestBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.math.BigDecimal;

public interface GuestBookingRepository extends JpaRepository<GuestBooking, UUID> {

    @Query("""
           SELECT COUNT(g) > 0
           FROM GuestBooking g
           WHERE g.room.id = :roomId
           AND g.status = 'ACTIVE'
           AND g.checkIn < :newCheckOut
           AND g.checkOut > :newCheckIn
           """)
    boolean existsOverlappingBooking(
            @Param("roomId") UUID roomId,
            @Param("newCheckIn") LocalDateTime newCheckIn,
            @Param("newCheckOut") LocalDateTime newCheckOut
    );

    @Query("""
           SELECT g
           FROM GuestBooking g
           WHERE g.status = 'ACTIVE'
           AND g.checkIn < :endDate
           AND g.checkOut > :startDate
           """)
    List<GuestBooking> findBookingsOverlappingDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("""
       SELECT COALESCE(SUM(g.totalDue), 0)
       FROM GuestBooking g
       WHERE g.checkIn >= :startDateTime
       AND g.checkIn < :endDateTime
       AND g.status <> 'CANCELLED'
       """)
    BigDecimal sumInvoiceTotalForDateRange(
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime
    );
}