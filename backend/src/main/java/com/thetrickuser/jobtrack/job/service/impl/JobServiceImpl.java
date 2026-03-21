package com.thetrickuser.jobtrack.job.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.thetrickuser.jobtrack.job.dto.JobRequest;
import com.thetrickuser.jobtrack.job.dto.JobResponse;
import com.thetrickuser.jobtrack.job.entity.Job;
import com.thetrickuser.jobtrack.job.mapper.JobMapper;
import com.thetrickuser.jobtrack.job.repository.JobRepository;
import com.thetrickuser.jobtrack.job.service.JobService;

@Service
@Slf4j
public class JobServiceImpl implements JobService {

  private final JobRepository jobRepository;
  private final JobMapper jobMapper;

  public JobServiceImpl(JobRepository jobRepository, JobMapper jobMapper) {
    this.jobRepository = jobRepository;
    this.jobMapper = jobMapper;
  }

  @Override
  @Transactional
  public JobResponse createJob(JobRequest jobRequest) {
    if (jobRequest == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Job request must not be null");
    }

    if (jobRepository.existsByJobUrl(jobRequest.getJobUrl())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Job already exists with same jobUrl");
    }

    Job entity = jobMapper.toEntity(jobRequest);
    entity.setCreatedAt(LocalDateTime.now());
    entity.setUpdatedAt(LocalDateTime.now());

    Job saved = jobRepository.save(entity);
    return jobMapper.toResponse(saved);
  }

  @Override
  public List<JobResponse> getJobs() {
    log.info("Fetching all jobs from repository");
    List<Job> jobs = jobRepository.findAll();
    List<JobResponse> responses = jobs.stream().map(job -> jobMapper.toResponse(job)).toList();
    log.info("Fetched {} jobs", responses.size());
    return responses;
  }

  @Override
  @Transactional
  public void deleteJobById(UUID jobId) {
    if (jobId == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Job id must not be null");
    }

    log.info("Attempting to delete job with id {}", jobId);
    Job existing = jobRepository.findById(jobId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found with id " + jobId));

    jobRepository.delete(existing);

    log.info("Deleted job with id {}", jobId);
  }
}
