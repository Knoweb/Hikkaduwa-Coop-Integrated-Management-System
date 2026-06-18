package com.coop.beer_garden_service.dto;

import lombok.Data;

@Data
public class SupplierRequest {
    private String supplierName;
    private String licenseNumber;
    private String territory;
    private String contactDetails;
    private String creditTerms;
}