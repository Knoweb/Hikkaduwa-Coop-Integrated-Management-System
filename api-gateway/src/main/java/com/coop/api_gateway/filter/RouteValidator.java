package com.coop.api_gateway.filter;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    public static final List<String> openApiEndpoints = List.of(
            "/auth/register",
            "/auth/token",
            "/eureka"
    );
    public static final Predicate<ServerHttpRequest> isApiSecured =
            request -> List.of("/auth/register", "/auth/token") // Add /auth/register here!
                    .stream()
                    .noneMatch(uri -> request.getURI().getPath().contains(uri));

    public Predicate<ServerHttpRequest> isSecured = request -> {
        String path = request.getURI().getPath();
        // If it IS in the list, return false (not secured). Otherwise, true (secured).
        boolean isSecured = openApiEndpoints.stream().noneMatch(path::contains);
        System.out.println("DEBUG: Path " + path + " is secured: " + isSecured);
        return isSecured;
    };
}

