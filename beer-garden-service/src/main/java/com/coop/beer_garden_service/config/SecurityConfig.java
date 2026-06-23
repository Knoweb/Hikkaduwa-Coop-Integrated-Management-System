package com.coop.beer_garden_service.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private HeaderAuthFilter headerAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // 1. SPECIFIC SECURED ENDPOINTS GO FIRST
                        .requestMatchers(HttpMethod.PUT, "/api/v1/beer-garden/items/*/price").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/beer-garden/items/**").hasRole("ADMIN")
                        // NOTICE: The payment role checks have been completely removed from here!

                        // 2. SPECIFIC PUBLIC ENDPOINTS
                        .requestMatchers("/api/v1/beer-garden/payments/**").permitAll()           // <-- Moved to PUBLIC
                        .requestMatchers("/api/v1/beer-garden/invoices/*/payments").permitAll() // <-- Moved to PUBLIC
                        .requestMatchers("/api/v1/beer-garden/prices").permitAll()
                        .requestMatchers("/api/v1/beer-garden/items").permitAll()
                        .requestMatchers("/api/v1/beer-garden/suppliers/**").permitAll()
                        .requestMatchers("/api/v1/beer-garden/grn").permitAll()
                        .requestMatchers("/api/v1/beer-garden/supplier-payments").permitAll()
                        .requestMatchers("/api/v1/beer-garden/issuances").permitAll()
                        .requestMatchers("/api/v1/beer-garden/invoices").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/beer-garden/invoices/*/priority").permitAll()
                        .requestMatchers("/api/v1/beer-garden/grn-history").permitAll()
                        .requestMatchers("/api/v1/beer-garden/receivables").permitAll()
                        .requestMatchers("/api/v1/beer-garden/purchase-history").permitAll()

                        // 3. THE CATCH-ALL GOES LAST
                        .requestMatchers("/api/v1/beer-garden/**").permitAll()

                        .anyRequest().authenticated()
                )
                .addFilterBefore(headerAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}