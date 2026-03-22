package com.pm.authService.service;

import com.pm.authService.dto.LoginRequestDTO;
import com.pm.authService.dto.SignupRequestDTO;
import com.pm.authService.model.Role;
import com.pm.authService.model.User;
import com.pm.authService.utils.JwtUtil;
import io.jsonwebtoken.JwtException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserService userService, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public Optional<String> authenticate(LoginRequestDTO loginRequestDTO) {
        Optional<String> token = userService.findByEmail(loginRequestDTO.getEmail())
                .filter(user -> passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword()))
                .map(user -> jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getName()));

        return token;
    }

    public boolean validateToken(String token) {
        try {
            jwtUtil.validateToken(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    public Optional<String> signup(SignupRequestDTO signupRequestDTO) {

        // 1. Check password & confirm password
        if (!signupRequestDTO.getPassword()
                .equals(signupRequestDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        // 2. Check if user already exists
        if (userService.findByEmail(signupRequestDTO.getEmail()).isPresent()) {
            throw new IllegalStateException("Email already registered");
        }

        // 3. Create User entity
        User user = new User();
        user.setName(signupRequestDTO.getName());
        user.setEmail(signupRequestDTO.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequestDTO.getPassword()));
        user.setRole(Role.USER); // default role for doctors/staff

        // 4. Save user
        userService.save(user);

        // 5. Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getName());

        return Optional.of(token);
    }

    public Optional<String> registerPatient(SignupRequestDTO signupRequestDTO) {
        // 1. Check if passwords match
        if (!signupRequestDTO.getPassword().equals(signupRequestDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        // 2. Check if email exists
        if (userService.findByEmail(signupRequestDTO.getEmail()).isPresent()) {
            throw new IllegalStateException("Email already registered");
        }

        // 3. Create Patient User
        User user = new User();
        user.setName(signupRequestDTO.getName());
        user.setEmail(signupRequestDTO.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequestDTO.getPassword()));
        user.setRole(Role.PATIENT); // Explicitly set to PATIENT

        // 4. Save
        userService.save(user);

        // 5. Generate Token
        return Optional.of(jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getName()));
    }
}
