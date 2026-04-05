package com.thetrickuser.jobtrack.user.service.impl;

import java.time.LocalDateTime;

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
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
    }

    User user = User.builder()
        .email(request.getEmail())
        .name(request.getName())
        .password(passwordEncoder.encode(request.getPassword()))
        .createdAt(LocalDateTime.now())
        .build();

    user = userRepository.save(user);

    String token = jwtUtil.generateToken(user);

    return AuthResponse.builder()
        .token(token)
        .email(user.getEmail())
        .name(user.getName())
        .build();
  }

  @Override
  public AuthResponse login(UserLoginRequest request) {
    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    String token = jwtUtil.generateToken(user);

    return AuthResponse.builder()
        .token(token)
        .email(user.getEmail())
        .name(user.getName())
        .build();
  }
}
