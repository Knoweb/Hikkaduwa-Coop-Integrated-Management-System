package com.coop.admin_service.repository;

import com.coop.admin_service.entity.AuditObservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AuditObservationRepository extends JpaRepository<AuditObservation, UUID> {
    List<AuditObservation> findByModule(String module);
    List<AuditObservation> findByAuditorId(String auditorId);
    List<AuditObservation> findAllByOrderByCreatedAtDesc();
}
