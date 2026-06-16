package com.hikkaduwa.room_section_service.service;

import com.hikkaduwa.room_section_service.dto.RoomRequest;
import com.hikkaduwa.room_section_service.entity.Room;
import com.hikkaduwa.room_section_service.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room createRoom(RoomRequest request) {
        roomRepository.findByRoomNumber(request.getRoomNumber())
                .ifPresent(existing -> {
                    throw new RuntimeException("Room number already exists");
                });

        validateRoomStatus(request.getStatus() == null ? "AVAILABLE" : request.getStatus());

        Room room = Room.builder()
                .roomNumber(request.getRoomNumber())
                .roomType(request.getRoomType())
                .basePrice(request.getBasePrice())
                .status(request.getStatus() == null ? "AVAILABLE" : request.getStatus())
                .build();

        return roomRepository.save(room);
    }

    public Room updateRoom(UUID id, RoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        roomRepository.findByRoomNumber(request.getRoomNumber())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new RuntimeException("Room number already exists");
                    }
                });

        validateRoomStatus(request.getStatus());

        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType());
        room.setBasePrice(request.getBasePrice());
        room.setStatus(request.getStatus());

        return roomRepository.save(room);
    }

    public Room updateRoomStatus(UUID id, String status) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        validateRoomStatus(status);

        room.setStatus(status);
        return roomRepository.save(room);
    }

    private void validateRoomStatus(String status) {
        if (status == null ||
                (!status.equals("AVAILABLE") &&
                        !status.equals("OCCUPIED") &&
                        !status.equals("MAINTENANCE"))) {
            throw new RuntimeException("Invalid room status");
        }
    }
}