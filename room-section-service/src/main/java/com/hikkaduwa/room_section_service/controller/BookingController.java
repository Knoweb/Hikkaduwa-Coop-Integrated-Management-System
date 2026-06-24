package com.hikkaduwa.room_section_service.controller;

import com.hikkaduwa.room_section_service.dto.AvailabilityResponse;
import com.hikkaduwa.room_section_service.dto.BookingRequest;
import com.hikkaduwa.room_section_service.dto.BookingResponse;
import com.hikkaduwa.room_section_service.entity.GuestBooking;
import com.hikkaduwa.room_section_service.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/bookings")
    public BookingResponse createBooking(@Valid @RequestBody BookingRequest request) {
        return bookingService.createBooking(request);
    }

    @GetMapping("/bookings")
    public List<GuestBooking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/availability")
    public List<AvailabilityResponse> checkAvailability(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate
    ) {
        return bookingService.checkAvailability(startDate, endDate);
    }

    @PatchMapping("/bookings/{id}/cancel")
    public GuestBooking cancelBooking(@PathVariable UUID id) {
        return bookingService.cancelBooking(id);
    }

    @PatchMapping("/bookings/{id}/checkout")
    public GuestBooking checkoutBooking(@PathVariable UUID id) {
        return bookingService.checkoutBooking(id);
    }

    @PatchMapping("/bookings/{id}/full-payment")
    public GuestBooking markFullPaymentReceived(@PathVariable UUID id) {
        return bookingService.markFullPaymentReceived(id);
    }
}