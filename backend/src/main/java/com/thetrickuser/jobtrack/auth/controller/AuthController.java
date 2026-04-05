package com.thetrickuser.jobtrack.auth.controller;

import jakarta.validation.Valid;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thetrickuser.jobtrack.user.dto.AuthResponse;
import com.thetrickuser.jobtrack.user.dto.UserLoginRequest;
import com.thetrickuser.jobtrack.user.dto.UserRegisterRequest;
import com.thetrickuser.jobtrack.user.service.UserService;

@RestController
@RequestMapping("/auth")
@Validated
@Slf4j
public class AuthController {

  private final UserService userService;

  public AuthController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@Valid @RequestBody UserRegisterRequest request) {
    log.info("User registration attempt for email: {}", request.getEmail());
    try {
      AuthResponse response = userService.register(request);
      log.info("User registered successfully: {}", request.getEmail());
      return ResponseEntity.status(HttpStatus.CREATED).body(response);
    } catch (Exception e) {
      log.error("User registration failed for email: {}", request.getEmail(), e);
      throw e;
    }
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody UserLoginRequest request) {
    log.info("User login attempt for email: {}", request.getEmail());
    try {
      AuthResponse response = userService.login(request);
      log.info("User logged in successfully: {}", request.getEmail());
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      log.warn("User login failed for email: {}", request.getEmail());
      throw e;
    }
  }

  @PostMapping("/logout")
  public ResponseEntity<Void> logout() {
    log.info("User logout request received");
    // JWT is stateless, so logout is handled on the client side by clearing the
    // token.
    // This endpoint exists for consistency and can be extended for audit logging or
    // token blacklisting in the future.
    return ResponseEntity.ok().build();
  }
}
