package com.coop.api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class GatewaySecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchange -> exchange
                        // Explicitly permit these
                        .pathMatchers("/auth/register", "/auth/token").permitAll()
                        // Permit EVERYTHING else so your AuthenticationFilter
                        // can handle the logic instead of Spring Security blocking it.
                        .anyExchange().permitAll()
                )
                .build();
    }
}