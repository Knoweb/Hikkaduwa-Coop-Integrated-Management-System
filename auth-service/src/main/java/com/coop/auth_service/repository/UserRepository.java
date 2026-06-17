package com.coop.auth_service.repository;

import com.coop.auth_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID; // ADD THIS IMPORT

// Update the generic type here to UUID
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
}