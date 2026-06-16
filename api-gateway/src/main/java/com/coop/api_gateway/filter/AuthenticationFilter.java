package com.coop.api_gateway.filter;

import com.coop.api_gateway.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Autowired
    private RouteValidator validator;

    @Autowired
    private JwtUtil jwtUtil;

    public static class Config {
        // Configuration properties can go here
    }

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return ((exchange, chain) -> {
            if (validator.isSecured.test(exchange.getRequest())) {

                if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    return onError(exchange, "Missing authorization header", HttpStatus.UNAUTHORIZED);
                }

                String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                    return onError(exchange, "Invalid Authorization header", HttpStatus.UNAUTHORIZED);
                }

                String token = authHeader.substring(7).trim();

                System.out.println("DEBUG: Validating token starting with: " + token.substring(0, 10));

                try {
                    jwtUtil.validateToken(token);
                    String role = jwtUtil.extractRole(token);
                    String path = exchange.getRequest().getURI().getPath();

                    if (!hasAccess(path, role)) {
                        return onError(exchange, "403 FORBIDDEN: Access Denied", HttpStatus.FORBIDDEN);
                    }

                } catch (Exception e) {
                    System.err.println("DEBUG: Token validation failed: " + e.getClass().getName() + " - " + e.getMessage());
                    return onError(exchange, "Unauthorized: " + e.getMessage(), HttpStatus.FORBIDDEN);
                }
            }
            return chain.filter(exchange);
        });
    }

    private boolean hasAccess(String path, String role) {
        if ("ROLE_ADMIN".equals(role)) return true;
        if (path.startsWith("/auth/secure-test")) return true;

        if (path.startsWith("/milk-shop") && "ROLE_MILK_SHOP".equals(role)) return true;
        if (path.startsWith("/beer-garden") && "ROLE_BEER_GARDEN".equals(role)) return true;
        if (path.startsWith("/room-section") && "ROLE_ROOM_SECTION".equals(role)) return true;
        return false;
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        exchange.getResponse().setStatusCode(httpStatus);
        return exchange.getResponse().setComplete();
    }
}