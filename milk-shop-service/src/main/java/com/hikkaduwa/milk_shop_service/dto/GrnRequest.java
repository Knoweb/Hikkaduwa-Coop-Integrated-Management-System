package com.hikkaduwa.milk_shop_service.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class GrnRequest {

    @NotNull(message = "Supplier ID is required")
    private UUID supplierId;

    @Valid
    @NotEmpty(message = "GRN must contain at least one item")
    private List<GrnItemRequest> items;
}