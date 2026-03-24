package com.thetrickuser.jobtrack.job.controller;

import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thetrickuser.jobtrack.job.dto.JobResponse;
import com.thetrickuser.jobtrack.job.service.JobService;

@RestController
@RequestMapping("/api/jobs")
@Validated
@Slf4j
public class JobController {

  private final JobService jobService;

  public JobController(JobService jobService) {
    this.jobService = jobService;
  }

  @GetMapping
  public ResponseEntity<List<JobResponse>> getJobs() {
    log.info("Received request to list all jobs");
    List<JobResponse> jobs = jobService.getJobs();
    log.info("Returning {} jobs", jobs.size());
    return ResponseEntity.ok(jobs);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteJob(@PathVariable("id") UUID jobId) {
    log.info("Received request to delete job with id {}", jobId);
    jobService.deleteJobById(jobId);
    log.info("Successfully deleted job with id {}", jobId);
    return ResponseEntity.noContent().build();
  }

}
