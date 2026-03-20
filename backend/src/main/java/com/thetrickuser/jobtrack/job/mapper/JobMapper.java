package com.thetrickuser.jobtrack.job.mapper;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import com.thetrickuser.jobtrack.job.dto.JobRequest;
import com.thetrickuser.jobtrack.job.dto.JobResponse;
import com.thetrickuser.jobtrack.job.entity.Job;

@Component
public class JobMapper {

  public Job toEntity(JobRequest request) {
    if (request == null) {
      return null;
    }

    return Job.builder()
        .title(request.getTitle())
        .company(request.getCompany())
        .jobUrl(request.getJobUrl())
        .source(request.getSource())
        .location(request.getLocation())
        .salaryMin(request.getSalaryMin())
        .salaryMax(request.getSalaryMax())
        .description(request.getDescription())
        .metadata(request.getMetadata())
        .createdAt(LocalDateTime.now())
        .updatedAt(LocalDateTime.now())
        .build();
  }

  public JobResponse toResponse(Job job) {
    if (job == null) {
      return null;
    }

    return JobResponse.builder()
        .id(job.getId())
        .title(job.getTitle())
        .company(job.getCompany())
        .jobUrl(job.getJobUrl())
        .source(job.getSource())
        .location(job.getLocation())
        .salaryMin(job.getSalaryMin())
        .salaryMax(job.getSalaryMax())
        .description(job.getDescription())
        .metadata(job.getMetadata())
        .createdAt(job.getCreatedAt())
        .updatedAt(job.getUpdatedAt())
        .build();
  }
}
