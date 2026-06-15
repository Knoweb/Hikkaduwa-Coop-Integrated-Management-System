package com.coop.auth_service.service;

import com.coop.auth_service.entity.User;
import com.coop.auth_service.repository.UserRepository; // <-- Import the repository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository repository; // <-- INJECT THE REPOSITORY HERE

    @Autowired
    private JwtService jwtService;

    public String saveUser(User user) {
        // Now that the repository is injected, you can also fix your save method!
        repository.save(user);
        return "User added to the system";
    }

    public String generateToken(String username, String password) {
        User user = repository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return jwtService.generateToken(username, user.getRole());
    }

    public void validateToken(String token) {
        jwtService.validateToken(token);
    }
}