package com.hikkaduwa.room_section_service.repository;

import com.hikkaduwa.room_section_service.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RoomRepository extends JpaRepository<Room, UUID> {

    Optional<Room> findByRoomNumber(String roomNumber);

    List<Room> findByStatus(String status);
}