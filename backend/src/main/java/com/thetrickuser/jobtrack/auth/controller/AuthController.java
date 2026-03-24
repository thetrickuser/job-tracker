package com.thetrickuser.jobtrack.auth.controller;

import jakarta.validation.Valid;

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
public class AuthController {

  private final UserService userService;

  public AuthController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@Valid @RequestBody UserRegisterRequest request) {
    AuthResponse response = userService.register(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody UserLoginRequest request) {
    AuthResponse response = userService.login(request);
    return ResponseEntity.ok(response);
  }
}
