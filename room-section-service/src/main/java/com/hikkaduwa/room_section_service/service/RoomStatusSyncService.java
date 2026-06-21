package com.hikkaduwa.room_section_service.service;

import com.hikkaduwa.room_section_service.entity.GuestBooking;
import com.hikkaduwa.room_section_service.entity.Room;
import com.hikkaduwa.room_section_service.repository.GuestBookingRepository;
import com.hikkaduwa.room_section_service.repository.RoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomStatusSyncService {

    private final GuestBookingRepository guestBookingRepository;
    private final RoomRepository roomRepository;

    @Transactional
    public void syncRoomStatuses() {
        LocalDateTime now = LocalDateTime.now();

        /*
         * Do not auto check-out when check-out time is over.
         * Check-out must be done manually after full payment is received.
         */
        List<GuestBooking> startedActiveBookings =
                guestBookingRepository.findStartedActiveBookings(now);

        Set<UUID> occupiedRoomIds = startedActiveBookings.stream()
                .map(booking -> booking.getRoom().getId())
                .collect(Collectors.toSet());

        List<Room> rooms = roomRepository.findAll();

        for (Room room : rooms) {
            if ("MAINTENANCE".equalsIgnoreCase(room.getStatus())) {
                continue;
            }

            if (occupiedRoomIds.contains(room.getId())) {
                room.setStatus("OCCUPIED");
            } else {
                room.setStatus("AVAILABLE");
            }
        }

        roomRepository.saveAll(rooms);
    }
}