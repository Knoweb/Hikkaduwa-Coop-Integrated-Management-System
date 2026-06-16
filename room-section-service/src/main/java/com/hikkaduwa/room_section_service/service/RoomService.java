package com.hikkaduwa.room_section_service.service;

import com.hikkaduwa.room_section_service.dto.RoomRequest;
import com.hikkaduwa.room_section_service.entity.Room;
import com.hikkaduwa.room_section_service.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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

        Room room = Room.builder()
                .roomNumber(request.getRoomNumber())
                .roomType(request.getRoomType())
                .basePrice(request.getBasePrice())
                .status(request.getStatus() == null ? "AVAILABLE" : request.getStatus())
                .build();

        return roomRepository.save(room);
    }
}