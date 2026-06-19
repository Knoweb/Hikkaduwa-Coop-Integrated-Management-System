package com.hikkaduwa.room_section_service.service;

import com.hikkaduwa.room_section_service.dto.RoomBillingSettingRequest;
import com.hikkaduwa.room_section_service.entity.RoomBillingSetting;
import com.hikkaduwa.room_section_service.repository.RoomBillingSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class RoomBillingSettingService {

    private final RoomBillingSettingRepository roomBillingSettingRepository;

    private static final int DEFAULT_ID = 1;

    public RoomBillingSetting getBillingSetting() {
        return roomBillingSettingRepository.findById(DEFAULT_ID)
                .orElseGet(() -> {
                    RoomBillingSetting setting = RoomBillingSetting.builder()
                            .id(DEFAULT_ID)
                            .vatRate(new BigDecimal("18.00"))
                            .ssclRate(new BigDecimal("2.50"))
                            .build();

                    return roomBillingSettingRepository.save(setting);
                });
    }

    public RoomBillingSetting updateBillingSetting(RoomBillingSettingRequest request) {
        RoomBillingSetting setting = getBillingSetting();

        setting.setVatRate(request.getVatRate());
        setting.setSsclRate(request.getSsclRate());

        return roomBillingSettingRepository.save(setting);
    }
}