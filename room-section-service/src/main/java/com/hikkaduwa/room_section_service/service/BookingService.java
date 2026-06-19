package com.hikkaduwa.room_section_service.service;

import com.hikkaduwa.room_section_service.dto.AvailabilityResponse;
import com.hikkaduwa.room_section_service.dto.BookingRequest;
import com.hikkaduwa.room_section_service.dto.BookingResponse;
import com.hikkaduwa.room_section_service.entity.GuestBooking;
import com.hikkaduwa.room_section_service.entity.Room;
import com.hikkaduwa.room_section_service.entity.RoomBillingSetting;
import com.hikkaduwa.room_section_service.repository.GuestBookingRepository;
import com.hikkaduwa.room_section_service.repository.RoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final RoomRepository roomRepository;
    private final GuestBookingRepository guestBookingRepository;
    private final RoomStatusSyncService roomStatusSyncService;
    private final RoomBillingSettingService roomBillingSettingService;

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        roomStatusSyncService.syncRoomStatuses();

        if (!request.getCheckOut().isAfter(request.getCheckIn())) {
            throw new RuntimeException("Check-out must be after check-in");
        }

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if ("MAINTENANCE".equalsIgnoreCase(room.getStatus())) {
            throw new RuntimeException("Room is under maintenance");
        }

        boolean overlapExists = guestBookingRepository.existsOverlappingBooking(
                room.getId(),
                request.getCheckIn(),
                request.getCheckOut()
        );

        if (overlapExists) {
            throw new RuntimeException("Room is already booked for the selected date range");
        }

        long noOfDays = ChronoUnit.DAYS.between(
                request.getCheckIn().toLocalDate(),
                request.getCheckOut().toLocalDate()
        );

        if (noOfDays <= 0) {
            noOfDays = 1;
        }

        long extraHours = 0;

        LocalDateTime expectedCheckOut = request.getCheckIn().plusDays(noOfDays);

        if (request.getCheckOut().isAfter(expectedCheckOut)) {
            long extraMinutes = ChronoUnit.MINUTES.between(
                    expectedCheckOut,
                    request.getCheckOut()
            );

            extraHours = (long) Math.ceil(extraMinutes / 60.0);
        }

        BigDecimal extraHourRate = room.getExtraHourRate() == null
                ? BigDecimal.ZERO
                : room.getExtraHourRate();

        BigDecimal roomCharge = room.getBasePrice()
                .multiply(BigDecimal.valueOf(noOfDays))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal extraHourCharge = extraHourRate
                .multiply(BigDecimal.valueOf(extraHours))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal subTotal = roomCharge
                .add(extraHourCharge)
                .setScale(2, RoundingMode.HALF_UP);

        RoomBillingSetting billingSetting = roomBillingSettingService.getBillingSetting();

        BigDecimal vatRate = billingSetting.getVatRate();
        BigDecimal ssclRate = billingSetting.getSsclRate();

        BigDecimal taxPercentage = vatRate
                .add(ssclRate)
                .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);

        BigDecimal taxAmount = subTotal
                .multiply(taxPercentage)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalDue = subTotal
                .add(taxAmount)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal advancePayment = request.getAdvancePayment() == null
                ? BigDecimal.ZERO
                : request.getAdvancePayment();

        BigDecimal balanceDue = totalDue.subtract(advancePayment);

        GuestBooking booking = GuestBooking.builder()
                .room(room)
                .guestName(request.getGuestName())
                .nicPassport(request.getNicPassport())
                .checkIn(request.getCheckIn())
                .checkOut(request.getCheckOut())
                .noOfDays((int) noOfDays)
                .extraHours((int) extraHours)
                .extraHourCharge(extraHourCharge)
                .vatRate(vatRate)
                .ssclRate(ssclRate)
                .advancePayment(advancePayment)
                .finalPaymentAmount(BigDecimal.ZERO)
                .finalPaymentDate(null)
                .paymentStatus(balanceDue.compareTo(BigDecimal.ZERO) <= 0 ? "PAID" : "PARTIAL")
                .subTotal(subTotal)
                .taxAmount(taxAmount)
                .totalDue(totalDue)
                .status("ACTIVE")
                .build();

        GuestBooking savedBooking = guestBookingRepository.save(booking);

        roomStatusSyncService.syncRoomStatuses();

        return BookingResponse.builder()
                .bookingId(savedBooking.getId())
                .roomNumber(room.getRoomNumber())
                .guestName(savedBooking.getGuestName())
                .checkIn(savedBooking.getCheckIn())
                .checkOut(savedBooking.getCheckOut())
                .noOfDays(noOfDays)
                .extraHours(extraHours)
                .roomCharge(roomCharge)
                .extraHourCharge(extraHourCharge)
                .vatRate(vatRate)
                .ssclRate(ssclRate)
                .subTotal(subTotal)
                .taxAmount(taxAmount)
                .totalDue(totalDue)
                .advancePayment(advancePayment)
                .finalPaymentAmount(BigDecimal.ZERO)
                .finalPaymentDate(null)
                .balanceDue(balanceDue)
                .paymentStatus(savedBooking.getPaymentStatus())
                .status(savedBooking.getStatus())
                .message("Booking created successfully")
                .build();
    }

    public List<GuestBooking> getAllBookings() {
        roomStatusSyncService.syncRoomStatuses();
        return guestBookingRepository.findAll();
    }

    public List<AvailabilityResponse> checkAvailability(
            LocalDateTime startDate,
            LocalDateTime endDate
    ) {
        roomStatusSyncService.syncRoomStatuses();

        List<Room> rooms = roomRepository.findAll();

        List<GuestBooking> overlappingBookings =
                guestBookingRepository.findBookingsOverlappingDateRange(startDate, endDate);

        Set<UUID> bookedRoomIds = overlappingBookings.stream()
                .map(booking -> booking.getRoom().getId())
                .collect(Collectors.toSet());

        return rooms.stream()
                .map(room -> {
                    boolean available = !bookedRoomIds.contains(room.getId())
                            && !"MAINTENANCE".equalsIgnoreCase(room.getStatus());

                    return AvailabilityResponse.builder()
                            .roomId(room.getId())
                            .roomNumber(room.getRoomNumber())
                            .roomType(room.getRoomType())
                            .status(room.getStatus())
                            .available(available)
                            .build();
                })
                .toList();
    }

    @Transactional
    public GuestBooking markFullPaymentReceived(UUID bookingId) {
        GuestBooking booking = guestBookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            throw new RuntimeException("Cannot receive payment for a cancelled booking");
        }

        if ("PAID".equalsIgnoreCase(booking.getPaymentStatus())) {
            throw new RuntimeException("Full payment already received");
        }

        BigDecimal advancePayment = booking.getAdvancePayment() == null
                ? BigDecimal.ZERO
                : booking.getAdvancePayment();

        BigDecimal totalDue = booking.getTotalDue() == null
                ? BigDecimal.ZERO
                : booking.getTotalDue();

        BigDecimal balanceAmount = totalDue.subtract(advancePayment);

        if (balanceAmount.compareTo(BigDecimal.ZERO) < 0) {
            balanceAmount = BigDecimal.ZERO;
        }

        booking.setFinalPaymentAmount(balanceAmount);
        booking.setFinalPaymentDate(LocalDateTime.now());
        booking.setPaymentStatus("PAID");

        return guestBookingRepository.save(booking);
    }

    @Transactional
    public GuestBooking cancelBooking(UUID bookingId) {
        GuestBooking booking = guestBookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getStatus().equals("ACTIVE")) {
            throw new RuntimeException("Only active bookings can be cancelled");
        }

        booking.setStatus("CANCELLED");

        GuestBooking savedBooking = guestBookingRepository.save(booking);

        roomStatusSyncService.syncRoomStatuses();

        return savedBooking;
    }

    @Transactional
    public GuestBooking checkoutBooking(UUID bookingId) {
        GuestBooking booking = guestBookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getStatus().equals("ACTIVE")) {
            throw new RuntimeException("Only active bookings can be checked out");
        }

        booking.setStatus("CHECKED_OUT");

        GuestBooking savedBooking = guestBookingRepository.save(booking);

        roomStatusSyncService.syncRoomStatuses();

        return savedBooking;
    }
}