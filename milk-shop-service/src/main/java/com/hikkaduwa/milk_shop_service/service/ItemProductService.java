package com.hikkaduwa.milk_shop_service.service;

import com.hikkaduwa.milk_shop_service.dto.ItemProductRequest;
import com.hikkaduwa.milk_shop_service.entity.ItemProduct;
import com.hikkaduwa.milk_shop_service.entity.StockLedger;
import com.hikkaduwa.milk_shop_service.repository.ItemProductRepository;
import com.hikkaduwa.milk_shop_service.repository.StockLedgerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemProductService {

    private final ItemProductRepository itemProductRepository;
    private final StockLedgerRepository stockLedgerRepository;

    public List<ItemProduct> getAllItems() {
        return itemProductRepository.findAll();
    }

    public ItemProduct createItem(ItemProductRequest request) {
        ItemProduct item = ItemProduct.builder()
                .name(request.getName())
                .category(request.getCategory())
                .reorderLevel(request.getReorderLevel())
                .unitPrice(request.getUnitPrice())
                .build();

        ItemProduct savedItem = itemProductRepository.save(item);

        StockLedger stockLedger = StockLedger.builder()
                .item(savedItem)
                .currentQty(0)
                .lastUpdated(LocalDateTime.now())
                .build();

        stockLedgerRepository.save(stockLedger);

        return savedItem;
    }
}