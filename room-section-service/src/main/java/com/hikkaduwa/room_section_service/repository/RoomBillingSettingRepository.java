package com.hikkaduwa.room_section_service.repository;

import com.hikkaduwa.room_section_service.entity.RoomBillingSetting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomBillingSettingRepository
        extends JpaRepository<RoomBillingSetting, Integer> {
}