package com.coop.admin_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_observation", schema = "schema_admin")
@Data
public class AuditObservation {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
        name = "UUID",
        strategy = "org.hibernate.id.UUIDGenerator"
    )
    private UUID id;

    @Column(name = "auditor_id", nullable = false)
    private String auditorId;

    @Column(name = "module", nullable = false)
    private String module;

    @Column(name = "entity_type")
    private String entityType;

    @Column(name = "entity_id")
    private UUID entityId;

    @Column(name = "reference_number")
    private String referenceNumber;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "comment", nullable = false)
    private String comment;

    @Column(name = "observation_type", nullable = false)
    private String observationType;

    @Column(name = "severity", nullable = false)
    private String severity;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "admin_response")
    private String adminResponse;

    @Column(name = "responded_by")
    private String respondedBy;

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    @Column(name = "resolved_by")
    private String resolvedBy;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = "OPEN";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
