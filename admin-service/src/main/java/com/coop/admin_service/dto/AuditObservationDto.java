package com.coop.admin_service.dto;

import lombok.Data;
import java.util.UUID;
import java.time.LocalDateTime;

@Data
public class AuditObservationDto {
    private UUID id;
    private String auditorId;
    private String module;
    private String entityType;
    private UUID entityId;
    private String referenceNumber;
    private String title;
    private String comment;
    private String observationType;
    private String severity;
    private String status;
    private String adminResponse;
    private String respondedBy;
    private LocalDateTime respondedAt;
    private String resolvedBy;
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
