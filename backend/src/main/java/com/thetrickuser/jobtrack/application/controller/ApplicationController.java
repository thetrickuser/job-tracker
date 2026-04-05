package com.thetrickuser.jobtrack.application.controller;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class ApplicationController {

  private final ApplicationService applicationService;

  public ApplicationController(ApplicationService applicationService) {
    this.applicationService = applicationService;
  }

  @PostMapping
  public ResponseEntity<ApplicationResponse> createApplication(@Valid @RequestBody JobRequest jobRequest) {
    String userEmail = SecurityUtils.getCurrentUserEmail()
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized"));

    log.info("Creating application for user: {} with job: {}", userEmail, jobRequest.getTitle());
    try {
      ApplicationResponse response = applicationService.createApplication(jobRequest, userEmail);
      log.info("Application created successfully for user: {} with ID: {}", userEmail, response.getId());
      return ResponseEntity.status(HttpStatus.CREATED).body(response);
    } catch (Exception e) {
      log.error("Failed to create application for user: {} with job: {}", userEmail, jobRequest.getTitle(), e);
      throw e;
    }
  }

  @GetMapping
  public ResponseEntity<List<ApplicationResponse>> getUserApplications() {
    String userEmail = SecurityUtils.getCurrentUserEmail()
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized"));

    log.info("Fetching applications for user: {}", userEmail);
    try {
      List<ApplicationResponse> responses = applicationService.getUserApplications(userEmail);
      log.info("Fetched {} applications for user: {}", responses.size(), userEmail);
      return ResponseEntity.ok(responses);
    } catch (Exception e) {
      log.error("Failed to fetch applications for user: {}", userEmail, e);
      throw e;
    }
  }

  @PatchMapping("/{id}")
  public ResponseEntity<ApplicationResponse> updateApplication(@PathVariable("id") UUID id,
      @RequestBody ApplicationUpdateRequest request) {
    String userEmail = SecurityUtils.getCurrentUserEmail()
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized"));

    log.info("Updating application {} for user: {}", id, userEmail);
    try {
      ApplicationResponse response = applicationService.updateApplication(id, request, userEmail);
      log.info("Application {} updated successfully for user: {}", id, userEmail);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      log.error("Failed to update application {} for user: {}", id, userEmail, e);
      throw e;
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteApplication(@PathVariable("id") UUID id) {
    String userEmail = SecurityUtils.getCurrentUserEmail()
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized"));

    log.info("Deleting application {} for user: {}", id, userEmail);
    try {
      applicationService.deleteApplication(id, userEmail);
      log.info("Application {} deleted successfully for user: {}", id, userEmail);
      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      log.error("Failed to delete application {} for user: {}", id, userEmail, e);
      throw e;
    }
  }
}
