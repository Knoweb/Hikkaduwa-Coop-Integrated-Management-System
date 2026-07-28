package com.coop.admin_service.controller;

import com.coop.admin_service.dto.AuditObservationDto;
import com.coop.admin_service.service.AuditObservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/audit-observations")
public class AuditObservationController {

    @Autowired
    private AuditObservationService service;

    @GetMapping
    @PreAuthorize("hasAnyRole('AUDITOR', 'ADMIN')")
    public ResponseEntity<List<AuditObservationDto>> getAllObservations() {
        return ResponseEntity.ok(service.getAllObservations());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('AUDITOR', 'ADMIN')")
    public ResponseEntity<AuditObservationDto> getObservation(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getObservation(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('AUDITOR', 'ADMIN')")
    public ResponseEntity<AuditObservationDto> createObservation(@RequestBody AuditObservationDto dto, Principal principal) {
        return ResponseEntity.ok(service.createObservation(dto, principal.getName()));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('AUDITOR')")
    public ResponseEntity<AuditObservationDto> updateObservation(@PathVariable UUID id, @RequestBody AuditObservationDto dto, Principal principal) {
        return ResponseEntity.ok(service.updateObservation(id, dto, principal.getName()));
    }

    @PostMapping("/{id}/response")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuditObservationDto> addAdminResponse(@PathVariable UUID id, @RequestBody String response, Principal principal) {
        return ResponseEntity.ok(service.addAdminResponse(id, response, principal.getName()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuditObservationDto> updateStatus(@PathVariable UUID id, @RequestBody String status, Principal principal) {
        return ResponseEntity.ok(service.updateStatus(id, status, principal.getName()));
    }
}
