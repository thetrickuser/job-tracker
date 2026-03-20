package com.thetrickuser.jobtrack.job.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thetrickuser.jobtrack.job.dto.JobRequest;
import com.thetrickuser.jobtrack.job.dto.JobResponse;
import com.thetrickuser.jobtrack.job.service.JobService;

@RestController
@RequestMapping("/api/jobs")
@Validated
public class JobController {

  private final JobService jobService;

  public JobController(JobService jobService) {
    this.jobService = jobService;
  }

  @PostMapping
  public ResponseEntity<JobResponse> createJob(@Valid @RequestBody JobRequest jobRequest) {
    JobResponse response = jobService.createJob(jobRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }
}
