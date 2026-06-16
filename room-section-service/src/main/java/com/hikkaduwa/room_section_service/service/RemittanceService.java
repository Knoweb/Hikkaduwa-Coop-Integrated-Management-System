package com.hikkaduwa.room_section_service.service;

import com.hikkaduwa.room_section_service.dto.RemittanceRequest;
import com.hikkaduwa.room_section_service.dto.RemittanceResponse;
import com.hikkaduwa.room_section_service.entity.DailyRemittance;
import com.hikkaduwa.room_section_service.repository.DailyRemittanceRepository;
import com.hikkaduwa.room_section_service.repository.GuestBookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RemittanceService {

    private final DailyRemittanceRepository dailyRemittanceRepository;
    private final GuestBookingRepository guestBookingRepository;

    public RemittanceResponse createRemittance(RemittanceRequest request) {

        dailyRemittanceRepository.findByRemittanceDate(request.getRemittanceDate())
                .ifPresent(existing -> {
                    throw new RuntimeException("Remittance already recorded for this date");
                });

        LocalDateTime startOfDay = request.getRemittanceDate().atStartOfDay();
        LocalDateTime nextDay = request.getRemittanceDate().plusDays(1).atStartOfDay();

        BigDecimal expectedInvoiceTotal = guestBookingRepository.sumInvoiceTotalForDateRange(
                startOfDay,
                nextDay
        );

        BigDecimal discrepancy = request.getTotalCollected().subtract(expectedInvoiceTotal);

        DailyRemittance remittance = DailyRemittance.builder()
                .remittanceDate(request.getRemittanceDate())
                .totalCollected(request.getTotalCollected())
                .receptionistId(request.getReceptionistId())
                .createdAt(LocalDateTime.now())
                .build();

        DailyRemittance saved = dailyRemittanceRepository.save(remittance);

        String message = discrepancy.compareTo(BigDecimal.ZERO) == 0
                ? "Remittance saved successfully. No discrepancy."
                : "Remittance saved successfully. Discrepancy detected.";

        return RemittanceResponse.builder()
                .remittanceId(saved.getId())
                .remittanceDate(saved.getRemittanceDate())
                .totalCollected(saved.getTotalCollected())
                .expectedInvoiceTotal(expectedInvoiceTotal)
                .discrepancy(discrepancy)
                .message(message)
                .build();
    }

    public List<DailyRemittance> getAllRemittances() {
        return dailyRemittanceRepository.findAll();
    }
}