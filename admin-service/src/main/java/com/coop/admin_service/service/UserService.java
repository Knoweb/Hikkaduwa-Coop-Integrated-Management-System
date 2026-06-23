package com.coop.admin_service.service;

import com.coop.admin_service.dto.UserDto;
import com.coop.admin_service.entity.AppUser;
import com.coop.admin_service.entity.AuditLog;
import com.coop.admin_service.repository.UserRepository;
import com.coop.admin_service.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final AuditLogRepository auditLogRepository;

    @Transactional
    public UserDto.Response createUser(UserDto.CreateRequest request) {
        if (repository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username already exists in the system.");
        }

        AppUser user = AppUser.builder()
                .name(request.name())
                .username(request.username())
                .passwordHash(passwordEncoder.encode(request.rawPassword()))
                .role(request.role())
                .isActive(true)
                .build();

        AppUser savedUser = repository.save(user);

        // 2. WRITE TO THE AUDIT LEDGER IMMEDIATELY AFTER SAVING
        AuditLog log = AuditLog.builder()
                // Ideally, you get the logged-in admin's ID from Spring Security.
                // For now, we use a placeholder or the new user's ID just to test.
                .userId(savedUser.getId())
                .serviceName("ADMIN-SERVICE")
                .action("CREATE_USER")
                .description("Provisioned new account for username: " + request.username() + " with role: " + request.role())
                .build();

        auditLogRepository.save(log); // Save the record!

        return mapToResponse(savedUser);
    }

    public List<UserDto.Response> getAllUsers() {
        return repository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void toggleUserStatus(UUID id) {
        AppUser user = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setIsActive(!user.getIsActive());
        repository.save(user);
    }

    private UserDto.Response mapToResponse(AppUser user) {
        return new UserDto.Response(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getRole(),
                user.getIsActive(),
                user.getCreatedAt()
        );
    }

    // Admin sets a new permanent password for the user
    @Transactional
    public void resetPassword(UUID id, String newRawPassword) {
        AppUser user = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Hash the new password and override the old one
        user.setPasswordHash(passwordEncoder.encode(newRawPassword));
        repository.save(user);
    }
}