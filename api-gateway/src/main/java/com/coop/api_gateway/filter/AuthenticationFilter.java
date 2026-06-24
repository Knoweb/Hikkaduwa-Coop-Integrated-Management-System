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
    }

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return ((exchange, chain) -> {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequest().getMethod().name())) {
                return chain.filter(exchange);
            }

            if (validator.isSecured.test(exchange.getRequest())) {
                
                String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                    return onError(exchange, "Invalid Authorization header", HttpStatus.UNAUTHORIZED);
                }

                String token = authHeader.substring(7).trim();
                try {
                    jwtUtil.validateToken(token);
                    String role = jwtUtil.extractRole(token);
                    String path = exchange.getRequest().getURI().getPath();

                    // 2. path එක පටන් ගන්නේ /api/v1/ වලින් නම් ඒකත් සැලකිල්ලට ගන්න
                    if (!hasAccess(path, role)) {
                        return onError(exchange, "FORBIDDEN: Access Denied", HttpStatus.FORBIDDEN);
                    }
                } catch (Exception e) {
                    return onError(exchange, "Unauthorized", HttpStatus.UNAUTHORIZED);
                }
            }
            return chain.filter(exchange);
        });
    }

    private boolean hasAccess(String path, String role) {
        if ("ROLE_ADMIN".equals(role)) return true;

        if (path.contains("/beer-garden") && "ROLE_BEER_GARDEN".equals(role)) return true;
        if (path.contains("/milk-shop") && "ROLE_MILK_SHOP".equals(role)) return true;
        if (path.contains("/room-section") && "ROLE_ROOM_SECTION".equals(role)) return true;
        
        return false;
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        exchange.getResponse().setStatusCode(httpStatus);
        return exchange.getResponse().setComplete();
    }
}