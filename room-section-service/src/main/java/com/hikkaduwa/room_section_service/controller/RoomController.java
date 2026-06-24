package com.hikkaduwa.room_section_service.controller;

import com.hikkaduwa.room_section_service.dto.RoomRequest;
import com.hikkaduwa.room_section_service.dto.RoomStatusRequest;
import com.hikkaduwa.room_section_service.entity.Room;
import com.hikkaduwa.room_section_service.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    @PostMapping
    public Room createRoom(@Valid @RequestBody RoomRequest request) {
        return roomService.createRoom(request);
    }

    @PutMapping("/{id}")
    public Room updateRoom(
            @PathVariable UUID id,
            @Valid @RequestBody RoomRequest request
    ) {
        return roomService.updateRoom(id, request);
    }

    @PatchMapping("/{id}/status")
    public Room updateRoomStatus(
            @PathVariable UUID id,
            @RequestBody RoomStatusRequest request
    ) {
        return roomService.updateRoomStatus(id, request.getStatus());
    }
}