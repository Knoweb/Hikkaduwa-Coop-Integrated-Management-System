package com.coop.beer_garden_service.service;

import com.coop.beer_garden_service.dto.GrnRequest;
import com.coop.beer_garden_service.entity.BeerItem;
import com.coop.beer_garden_service.entity.GrnInvoice;
import com.coop.beer_garden_service.entity.GrnItem;
import com.coop.beer_garden_service.entity.Supplier;
import com.coop.beer_garden_service.repository.BeerItemRepository;
import com.coop.beer_garden_service.repository.GrnInvoiceRepository;
import com.coop.beer_garden_service.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class GrnService {

    @Autowired
    private GrnInvoiceRepository grnRepository;
    @Autowired
    private SupplierRepository supplierRepository;
    @Autowired
    private BeerItemRepository beerItemRepository;

    @Transactional // Acid strictness: Fail one, fail all.
    public GrnInvoice processProcurement(GrnRequest request) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        GrnInvoice grn = new GrnInvoice();
        grn.setSupplierId(supplier.getId());
        grn.setInvoiceReference(request.getInvoiceReference());
        grn.setPaymentMethod(request.getPaymentMethod().toUpperCase());

        BigDecimal totalGrnValue = BigDecimal.ZERO;

        // 1. Process Line Items and Update Inventory Stock
        for (GrnRequest.GrnItemRequest itemReq : request.getItems()) {
            BeerItem catalogItem = beerItemRepository.findById(itemReq.getBeerItemId())
                    .orElseThrow(() -> new RuntimeException("Beer Item not found in catalog"));

            // Calculate Line Total
            BigDecimal lineTotal = itemReq.getUnitCost().multiply(new BigDecimal(itemReq.getQuantity()));
            totalGrnValue = totalGrnValue.add(lineTotal);

            // Create GRN Line Item
            GrnItem item = new GrnItem();
            item.setGrnInvoice(grn);
            item.setBeerItemId(catalogItem.getId());
            item.setQuantity(itemReq.getQuantity());
            item.setUnitCost(itemReq.getUnitCost());
            item.setLineTotal(lineTotal);
            grn.getItems().add(item);

            // Update Master Inventory Stock
            catalogItem.setCurrentStock(catalogItem.getCurrentStock() + itemReq.getQuantity());
            beerItemRepository.save(catalogItem);
        }

        grn.setTotalAmount(totalGrnValue);

        // 2. Handle Cash vs Credit Accounting
        if ("CASH".equals(grn.getPaymentMethod())) {
            // Cash paid instantly: Outstanding balance does not increase.
            grn.setAmountPaid(totalGrnValue);
            // Optional: Here you would also create a record in supplier_payments
        } else {
            // Credit: Supplier balance increases
            grn.setAmountPaid(BigDecimal.ZERO);
            supplier.setOutstandingBalance(supplier.getOutstandingBalance().add(totalGrnValue));
            supplierRepository.save(supplier);
        }

        return grnRepository.save(grn);
    }
}