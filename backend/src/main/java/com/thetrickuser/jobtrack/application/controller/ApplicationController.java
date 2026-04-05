package com.thetrickuser.jobtrack.application.controller;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.thetrickuser.jobtrack.application.dto.ApplicationResponse;
import com.thetrickuser.jobtrack.application.dto.ApplicationUpdateRequest;
import com.thetrickuser.jobtrack.application.service.ApplicationService;
import com.thetrickuser.jobtrack.job.dto.JobRequest;
import com.thetrickuser.jobtrack.security.SecurityUtils;

@RestController
@RequestMapping("/api/applications")
@Validated
public class ApplicationController {

  private final ApplicationService applicationService;

  public ApplicationController(ApplicationService applicationService) {
    this.applicationService = applicationService;
  }

  @PostMapping
  public ResponseEntity<ApplicationResponse> createApplication(@Valid @RequestBody JobRequest jobRequest) {
    String userEmail = SecurityUtils.getCurrentUserEmail()
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized"));
    ApplicationResponse response = applicationService.createApplication(jobRequest, userEmail);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @GetMapping
  public ResponseEntity<List<ApplicationResponse>> getUserApplications() {
    String userEmail = SecurityUtils.getCurrentUserEmail()
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized"));
    List<ApplicationResponse> responses = applicationService.getUserApplications(userEmail);
    return ResponseEntity.ok(responses);
  }

  @PatchMapping("/{id}")
  public ResponseEntity<ApplicationResponse> updateApplication(@PathVariable("id") UUID id,
      @RequestBody ApplicationUpdateRequest request) {
    String userEmail = SecurityUtils.getCurrentUserEmail()
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized"));
    ApplicationResponse response = applicationService.updateApplication(id, request, userEmail);
    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteApplication(@PathVariable("id") UUID id) {
    String userEmail = SecurityUtils.getCurrentUserEmail()
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized"));
    applicationService.deleteApplication(id, userEmail);
    return ResponseEntity.noContent().build();
  }
}
