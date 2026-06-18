package com.coop.beer_garden_service.service;

import com.coop.beer_garden_service.dto.InvoiceRequest;
import com.coop.beer_garden_service.entity.IssuanceInvoice;
import com.coop.beer_garden_service.repository.BeerPriceListRepository;
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

    @Autowired
    private BeerPriceListRepository priceListRepository;

    public List<IssuanceInvoice> getReceivables(String status) {
        if (status == null || status.isEmpty() || status.equalsIgnoreCase("ALL")) {
            return invoiceRepository.findAll();
        }
        return invoiceRepository.findByStatus(status.toUpperCase());
    }

    @Transactional
    public IssuanceInvoice createIssuance(InvoiceRequest request) {
        BigDecimal totalLiquorValue = request.getTotalLiquorValue();
        int totalQuantity = request.getItems().stream().mapToInt(InvoiceRequest.InvoiceItem::getQuantity).sum();

        BigDecimal commissionTotal = request.getCommissionPerUnit().multiply(new BigDecimal(totalQuantity));
        BigDecimal grandTotal = totalLiquorValue.add(commissionTotal);

        IssuanceInvoice invoice = new IssuanceInvoice();
        invoice.setRestaurantId(request.getRestaurantId());
        invoice.setRestaurantOperatorName(request.getRestaurantOperatorName());
        invoice.setTotalLiquorValue(totalLiquorValue);
        invoice.setCommissionTotal(commissionTotal);
        invoice.setGrandTotal(grandTotal);
        invoice.setStatus("UNPAID");
        invoice.setIssuedDate(LocalDateTime.now());
        invoice.setPriorityLevel(request.getPriorityLevel());

        return invoiceRepository.save(invoice);
    }

    // 2. Parana Invoice method eka (Meka naththam error enawa, oyage controller eke thiyena nisa)
    @Transactional
    public IssuanceInvoice createInvoice(InvoiceRequest request) {
        // meka thama oya kalin liyapu logic eka
        return createIssuance(request);
    }
}