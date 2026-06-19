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

        BigDecimal expectedInvoiceTotal = calculateExpectedCashTotal(
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

        return buildRemittanceResponse(saved, expectedInvoiceTotal, discrepancy);
    }

    public List<RemittanceResponse> getAllRemittances() {
        return dailyRemittanceRepository.findAll()
                .stream()
                .map(remittance -> {
                    LocalDateTime startOfDay = remittance.getRemittanceDate().atStartOfDay();
                    LocalDateTime nextDay = remittance.getRemittanceDate().plusDays(1).atStartOfDay();

                    BigDecimal expectedInvoiceTotal = calculateExpectedCashTotal(
                            startOfDay,
                            nextDay
                    );

                    BigDecimal discrepancy = remittance.getTotalCollected()
                            .subtract(expectedInvoiceTotal);

                    return buildRemittanceResponse(
                            remittance,
                            expectedInvoiceTotal,
                            discrepancy
                    );
                })
                .toList();
    }

    private BigDecimal calculateExpectedCashTotal(
            LocalDateTime startOfDay,
            LocalDateTime nextDay
    ) {
        BigDecimal advancePayments = guestBookingRepository.sumAdvancePaymentsForDateRange(
                startOfDay,
                nextDay
        );

        BigDecimal finalPayments = guestBookingRepository.sumFinalPaymentsForDateRange(
                startOfDay,
                nextDay
        );

        if (advancePayments == null) {
            advancePayments = BigDecimal.ZERO;
        }

        if (finalPayments == null) {
            finalPayments = BigDecimal.ZERO;
        }

        return advancePayments.add(finalPayments);
    }

    private RemittanceResponse buildRemittanceResponse(
            DailyRemittance remittance,
            BigDecimal expectedInvoiceTotal,
            BigDecimal discrepancy
    ) {
        String message = discrepancy.compareTo(BigDecimal.ZERO) == 0
                ? "No discrepancy."
                : "Discrepancy detected.";

        return RemittanceResponse.builder()
                .id(remittance.getId())
                .remittanceId(remittance.getId())
                .remittanceDate(remittance.getRemittanceDate())
                .totalCollected(remittance.getTotalCollected())
                .expectedInvoiceTotal(expectedInvoiceTotal)
                .discrepancy(discrepancy)
                .receptionistId(remittance.getReceptionistId())
                .message(message)
                .build();
    }
}