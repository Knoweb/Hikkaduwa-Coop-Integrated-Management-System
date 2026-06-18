package com.coop.beer_garden_service.service;

import com.coop.beer_garden_service.dto.InvoiceRequest;
import com.coop.beer_garden_service.entity.IssuanceInvoice;
import com.coop.beer_garden_service.repository.IssuanceInvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BeerGardenService {

    @Autowired
    private IssuanceInvoiceRepository invoiceRepository;

    // සියලුම ඉන්වොයිසි ලබා ගැනීම
    public List<IssuanceInvoice> getReceivables() {
        return invoiceRepository.findAll();
    }

    @Transactional
    public IssuanceInvoice createIssuance(InvoiceRequest request) {
        // ගණනය කිරීම්
        BigDecimal totalStockValue = request.getTotalLiquorValue();

        // Items ලැයිස්තුව හරහා මුළු ප්‍රමාණය ගණනය කිරීම
        int totalQuantity = request.getItems().stream()
                .mapToInt(InvoiceRequest.InvoiceItem::getQuantity)
                .sum();

        // Commission ගණනය කිරීම
        BigDecimal commissionTotal = request.getCommissionPerUnit().multiply(new BigDecimal(totalQuantity));
        BigDecimal grandTotal = totalStockValue.add(commissionTotal);

        // Entity එක සකස් කිරීම
        IssuanceInvoice invoice = new IssuanceInvoice();
        invoice.setInvoiceNumber("INV-" + System.currentTimeMillis() % 1000000000);
        invoice.setOperatorName(request.getRestaurantOperatorName());
        invoice.setTotalStockValue(totalStockValue);
        invoice.setTotalCommission(commissionTotal);
        invoice.setGrandTotal(grandTotal);
        invoice.setIssuedDate(LocalDateTime.now());
        invoice.setIssuedByRole("ROLE_ADMIN");

        return invoiceRepository.save(invoice);
    }
}