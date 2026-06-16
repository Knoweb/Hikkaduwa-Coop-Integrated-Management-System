package com.hikkaduwa.milk_shop_service.service;

import com.hikkaduwa.milk_shop_service.entity.StockLedger;
import com.hikkaduwa.milk_shop_service.repository.StockLedgerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StockLedgerService {

    private final StockLedgerRepository stockLedgerRepository;

    public List<StockLedger> getAllStock() {
        return stockLedgerRepository.findAll();
    }

    public List<StockLedger> getLowStockItems() {
        return stockLedgerRepository.findLowStockItems();
    }

    public List<StockLedger> getOutOfStockItems() {
        return stockLedgerRepository.findOutOfStockItems();
    }
}