package com.pm.authService.service;

import com.pm.authService.model.Role;
import com.pm.authService.model.User;
import com.pm.authService.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void save(User user) {
        userRepository.save(user);
    }

    public List<User> findAllDoctors() {
        return userRepository.findByRole(Role.USER);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public long countDoctors() {
        return userRepository.countByRole(Role.USER);
    }

    public List<User> findBySpecialty(String specialty) {
        return userRepository.findBySpecialty(specialty);
    }

    public void updateSpecialty(java.util.UUID userId, String specialty) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setSpecialty(specialty);
        userRepository.save(user);
    }

    public void updateSpecialtyByEmail(String email, String specialty) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setSpecialty(specialty);
        userRepository.save(user);
    }
}
