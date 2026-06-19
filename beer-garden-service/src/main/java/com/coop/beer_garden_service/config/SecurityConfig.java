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

                        .requestMatchers("/api/v1/beer-garden/prices").permitAll()
                        .requestMatchers("/api/v1/beer-garden/items").permitAll()

                        // Transactional Endpoints (TEMPORARILY PERMIT ALL FOR DEV)
                        .requestMatchers("/api/v1/beer-garden/suppliers").permitAll()
                        .requestMatchers("/api/v1/beer-garden/grn").permitAll()
                        .requestMatchers("/api/v1/beer-garden/supplier-payments").permitAll()

                        .requestMatchers("/api/v1/beer-garden/issuances").permitAll()

                        .requestMatchers("/api/v1/beer-garden/invoices").permitAll()
                        .requestMatchers("/api/v1/beer-garden/invoices/*/payments").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/beer-garden/invoices/*/priority").permitAll()

                        .requestMatchers(HttpMethod.PUT, "/api/v1/beer-garden/items/*/price").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/beer-garden/items/**").hasRole("ADMIN")

                        .requestMatchers("/api/v1/beer-garden/payments").permitAll()

                        .requestMatchers("/api/v1/beer-garden/grn-history").permitAll()
                        .requestMatchers("/api/v1/beer-garden/receivables").permitAll()
                        .requestMatchers("/api/v1/beer-garden/purchase-history").permitAll()
                        .requestMatchers("/api/v1/beer-garden/suppliers/**", "/api/v1/beer-garden/supplier-payments").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(headerAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}