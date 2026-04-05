package com.thetrickuser.jobtrack.user.service.impl;

import java.time.LocalDateTime;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.thetrickuser.jobtrack.security.JwtUtil;
import com.thetrickuser.jobtrack.user.dto.AuthResponse;
import com.thetrickuser.jobtrack.user.dto.UserLoginRequest;
import com.thetrickuser.jobtrack.user.dto.UserRegisterRequest;
import com.thetrickuser.jobtrack.user.entity.User;
import com.thetrickuser.jobtrack.user.repository.UserRepository;
import com.thetrickuser.jobtrack.user.service.UserService;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;

  public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtil = jwtUtil;
  }

  @Override
  @Transactional
  public AuthResponse register(UserRegisterRequest request) {
    log.info("Processing user registration for email: {}", request.getEmail());

    if (userRepository.existsByEmail(request.getEmail())) {
      log.warn("Registration failed: Email already exists: {}", request.getEmail());
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
    }

    User user = User.builder()
        .email(request.getEmail())
        .name(request.getName())
        .password(passwordEncoder.encode(request.getPassword()))
        .createdAt(LocalDateTime.now())
        .build();

    user = userRepository.save(user);
    log.info("User saved to database: {}", user.getId());

    String token = jwtUtil.generateToken(user);
    log.debug("JWT token generated for user: {}", user.getEmail());

    AuthResponse response = AuthResponse.builder()
        .token(token)
        .email(user.getEmail())
        .name(user.getName())
        .build();

    log.info("User registration completed successfully for: {}", user.getEmail());
    return response;
  }

  @Override
  public AuthResponse login(UserLoginRequest request) {
    log.info("Processing user login for email: {}", request.getEmail());

    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> {
          log.warn("Login failed: User not found for email: {}", request.getEmail());
          return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        });

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
      log.warn("Login failed: Invalid password for email: {}", request.getEmail());
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    String token = jwtUtil.generateToken(user);
    log.debug("JWT token generated for user: {}", user.getEmail());

    AuthResponse response = AuthResponse.builder()
        .token(token)
        .email(user.getEmail())
        .name(user.getName())
        .build();

    log.info("User login completed successfully for: {}", user.getEmail());
    return response;
  }
}
