package com.thetrickuser.jobtrack.application.dto;

import jakarta.validation.constraints.NotNull;

import com.thetrickuser.jobtrack.job.dto.JobRequest;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationCreateRequest {

  @NotNull
  private JobRequest job;

  private String notes;

  private String feedback;
}
