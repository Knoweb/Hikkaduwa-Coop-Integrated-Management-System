package com.coop.admin_service.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class HeaderAuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String userRole = request.getHeader("X-User-Role");
        String username = request.getHeader("X-User-Name");

        if (userRole != null && !userRole.isEmpty()) {
            
            // Enforce Auditor Read-Only (except audit observations)
            if ("ROLE_AUDITOR".equals(userRole) || "AUDITOR".equals(userRole)) {
                String method = request.getMethod();
                String path = request.getRequestURI();
                if (!method.equalsIgnoreCase("GET") && !method.equalsIgnoreCase("OPTIONS") && !path.contains("/audit-observations")) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.getWriter().write("Auditor has read-only access.");
                    return;
                }
            }

            String roleName = userRole.startsWith("ROLE_") ? userRole : "ROLE_" + userRole.toUpperCase();
            SimpleGrantedAuthority authority = new SimpleGrantedAuthority(roleName);
            
            // Use username as principal for Audit comments tracking
            String principal = (username != null && !username.isEmpty()) ? username : "unknown";
            
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(principal, null, Collections.singletonList(authority));

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
}
