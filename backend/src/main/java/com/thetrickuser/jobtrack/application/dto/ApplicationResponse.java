package com.thetrickuser.jobtrack.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.thetrickuser.jobtrack.application.entity.ApplicationStatus;
import com.thetrickuser.jobtrack.job.dto.JobResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {

  private UUID id;
  private JobResponse job;
  private ApplicationStatus status;
  private LocalDateTime appliedAt;
  private String notes;
  private String feedback;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
