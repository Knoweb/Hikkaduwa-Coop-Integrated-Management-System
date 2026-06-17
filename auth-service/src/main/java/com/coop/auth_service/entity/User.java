package com.coop.auth_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID; // ADD THIS IMPORT

@Entity
@Table(name = "users", schema = "schema_admin")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // UPDATE THIS
    private UUID id; // UPDATE THIS TO UUID

    private String name;

    @Column(nullable = false, unique = true)
    private String username;

    // Map your Java 'password' field to the SQL 'password_hash' column
    @Column(name = "password_hash", nullable = false)
    private String password;

    private String role;
}