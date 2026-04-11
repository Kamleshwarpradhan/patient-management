package com.pm.authService.controller;

import com.pm.authService.dto.LoginRequestDTO;
import com.pm.authService.dto.LoginResponseDTO;
import com.pm.authService.dto.SignupResponseDTO;
import com.pm.authService.dto.SignupRequestDTO;
import com.pm.authService.dto.UserResponseDTO;
import com.pm.authService.service.AuthService;
import com.pm.authService.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authenticate, UserService userService) {
        this.authService = authenticate;
        this.userService = userService;
    }

    @Operation(summary = "Generate Token on User Login")
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequestDTO) {

        Optional<String> token = authService.authenticate(loginRequestDTO);

        if (token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String validToken = token.get();
        return ResponseEntity.ok().body(new LoginResponseDTO(validToken));
    }

    @Operation(summary = "Validate Token")
    @GetMapping("/validate")
    public ResponseEntity<Void> validateToken(@RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return authService.validateToken(authHeader.substring(7))
                ? ResponseEntity.ok().build()
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

    }

    @Operation(summary = "Generate token on User Signup")
    @PostMapping("/register")
    public ResponseEntity<SignupResponseDTO> signup(@RequestBody SignupRequestDTO sigupRequestDTO) {
        String token = authService.signup(sigupRequestDTO)
                .orElseThrow(() -> new RuntimeException("Signup failed"));

        return ResponseEntity.ok().body(new SignupResponseDTO(token));

    }

    @Operation(summary = "Generate token on Patient Signup")
    @PostMapping("/register-patient")
    public ResponseEntity<SignupResponseDTO> registerPatient(@RequestBody SignupRequestDTO signupRequestDTO) {
        String token = authService.registerPatient(signupRequestDTO)
                .orElseThrow(() -> new RuntimeException("Signup failed"));

        return ResponseEntity.ok().body(new SignupResponseDTO(token));
    }

    @Operation(summary = "Get all users — ADMIN only")
    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDTO>> getUsers(
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {

        if (!"ADMIN".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<UserResponseDTO> users = userService.findAllUsers().stream()
                .map(user -> new UserResponseDTO(
                        user.getId().toString(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()))
                .toList();

        return ResponseEntity.ok().body(users);
    }

    @Operation(summary = "Delete user — ADMIN only")
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        
        if (!"ADMIN".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        userService.deleteUser(java.util.UUID.fromString(id));
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Get user count stats — ADMIN only")
    @GetMapping("/users/count")
    public ResponseEntity<Map<String, Long>> getUserCount(
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {

        if (!"ADMIN".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        long doctorCount = userService.countDoctors();
        return ResponseEntity.ok().body(Map.of("doctors", doctorCount));
    }
}
