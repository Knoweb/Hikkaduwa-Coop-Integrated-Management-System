package com.hikkaduwa.room_section_service.repository;

import com.hikkaduwa.room_section_service.entity.DailyRemittance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

public interface DailyRemittanceRepository extends JpaRepository<DailyRemittance, UUID> {

    Optional<DailyRemittance> findByRemittanceDate(LocalDate remittanceDate);
}