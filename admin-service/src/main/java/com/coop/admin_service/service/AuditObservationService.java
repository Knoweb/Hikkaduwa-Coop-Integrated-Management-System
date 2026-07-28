package com.coop.admin_service.service;

import com.coop.admin_service.dto.AuditObservationDto;
import com.coop.admin_service.entity.AuditLog;
import com.coop.admin_service.entity.AuditObservation;
import com.coop.admin_service.entity.AppUser;
import com.coop.admin_service.repository.AuditLogRepository;
import com.coop.admin_service.repository.AuditObservationRepository;
import com.coop.admin_service.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuditObservationService {

    @Autowired
    private AuditObservationRepository repository;
    
    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private UserRepository userRepository;

    public List<AuditObservationDto> getAllObservations() {
        return repository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public AuditObservationDto getObservation(UUID id) {
        return repository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new RuntimeException("Observation not found"));
    }

    public AuditObservationDto createObservation(AuditObservationDto dto, String principal) {
        AuditObservation entity = new AuditObservation();
        BeanUtils.copyProperties(dto, entity, "id", "createdAt", "updatedAt");
        
        entity.setAuditorId(principal); // Force auditor ID to be the logged-in user
        entity.setStatus("OPEN");
        
        AuditObservation saved = repository.save(entity);
        logAction(principal, "CREATE_OBSERVATION", "Created new observation: " + saved.getTitle());
        
        return convertToDto(saved);
    }

    public AuditObservationDto updateObservation(UUID id, AuditObservationDto dto, String principal) {
        AuditObservation entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Observation not found"));

        if (!entity.getAuditorId().equals(principal)) {
            throw new RuntimeException("You can only edit your own observations");
        }
        
        if (!"OPEN".equals(entity.getStatus())) {
            throw new RuntimeException("Cannot edit a responded or resolved observation");
        }

        entity.setModule(dto.getModule());
        entity.setEntityType(dto.getEntityType());
        entity.setEntityId(dto.getEntityId());
        entity.setReferenceNumber(dto.getReferenceNumber());
        entity.setTitle(dto.getTitle());
        entity.setComment(dto.getComment());
        entity.setObservationType(dto.getObservationType());
        entity.setSeverity(dto.getSeverity());
        
        AuditObservation saved = repository.save(entity);
        logAction(principal, "UPDATE_OBSERVATION", "Updated observation: " + saved.getTitle());
        
        return convertToDto(saved);
    }

    public AuditObservationDto addAdminResponse(UUID id, String response, String principal) {
        AuditObservation entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Observation not found"));

        entity.setAdminResponse(response);
        entity.setRespondedBy(principal);
        entity.setRespondedAt(LocalDateTime.now());
        
        if ("OPEN".equals(entity.getStatus())) {
            entity.setStatus("RESPONDED");
        }
        
        AuditObservation saved = repository.save(entity);
        logAction(principal, "RESPOND_OBSERVATION", "Admin " + principal + " responded to observation: " + saved.getTitle());
        
        return convertToDto(saved);
    }

    public AuditObservationDto updateStatus(UUID id, String status, String principal) {
        AuditObservation entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Observation not found"));

        entity.setStatus(status);
        if ("RESOLVED".equals(status) && entity.getResolvedAt() == null) {
            entity.setResolvedBy(principal);
            entity.setResolvedAt(LocalDateTime.now());
        }
        
        AuditObservation saved = repository.save(entity);
        logAction(principal, "UPDATE_OBSERVATION_STATUS", "Updated status to " + status + " for observation: " + saved.getTitle());
        
        return convertToDto(saved);
    }

    private void logAction(String username, String action, String description) {
        userRepository.findByUsername(username).ifPresent(user -> {
            AuditLog log = AuditLog.builder()
                    .userId(user.getId())
                    .serviceName("ADMIN-SERVICE")
                    .action(action)
                    .description(description)
                    .build();
            auditLogRepository.save(log);
        });
    }

    private AuditObservationDto convertToDto(AuditObservation entity) {
        AuditObservationDto dto = new AuditObservationDto();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }
}
