package com.hikkaduwa.room_section_service.service;

import com.hikkaduwa.room_section_service.dto.AvailabilityResponse;
import com.hikkaduwa.room_section_service.dto.BookingRequest;
import com.hikkaduwa.room_section_service.dto.BookingResponse;
import com.hikkaduwa.room_section_service.entity.GuestBooking;
import com.hikkaduwa.room_section_service.entity.Room;
import com.hikkaduwa.room_section_service.repository.GuestBookingRepository;
import com.hikkaduwa.room_section_service.repository.RoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
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

    // For the demo project. Later you can move these to application.properties.
    private static final BigDecimal VAT_RATE = new BigDecimal("0.18");
    private static final BigDecimal SSCL_RATE = new BigDecimal("0.025");

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {

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

        BigDecimal subTotal = room.getBasePrice()
                .multiply(BigDecimal.valueOf(noOfDays))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal taxAmount = subTotal
                .multiply(VAT_RATE.add(SSCL_RATE))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalDue = subTotal
                .add(taxAmount)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal advancePayment = request.getAdvancePayment() == null
                ? BigDecimal.ZERO
                : request.getAdvancePayment();

        GuestBooking booking = GuestBooking.builder()
                .room(room)
                .guestName(request.getGuestName())
                .nicPassport(request.getNicPassport())
                .checkIn(request.getCheckIn())
                .checkOut(request.getCheckOut())
                .advancePayment(advancePayment)
                .subTotal(subTotal)
                .taxAmount(taxAmount)
                .totalDue(totalDue)
                .status("ACTIVE")
                .build();

        GuestBooking savedBooking = guestBookingRepository.save(booking);

        room.setStatus("OCCUPIED");
        roomRepository.save(room);

        return BookingResponse.builder()
                .bookingId(savedBooking.getId())
                .roomNumber(room.getRoomNumber())
                .guestName(savedBooking.getGuestName())
                .checkIn(savedBooking.getCheckIn())
                .checkOut(savedBooking.getCheckOut())
                .noOfDays(noOfDays)
                .subTotal(subTotal)
                .taxAmount(taxAmount)
                .totalDue(totalDue)
                .advancePayment(advancePayment)
                .balanceDue(totalDue.subtract(advancePayment))
                .status(savedBooking.getStatus())
                .message("Booking created successfully")
                .build();
    }

    public List<GuestBooking> getAllBookings() {
        return guestBookingRepository.findAll();
    }

    public List<AvailabilityResponse> checkAvailability(
            java.time.LocalDateTime startDate,
            java.time.LocalDateTime endDate
    ) {
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
}