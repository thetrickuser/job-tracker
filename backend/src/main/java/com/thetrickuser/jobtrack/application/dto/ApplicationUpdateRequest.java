package com.thetrickuser.jobtrack.application.dto;

import com.thetrickuser.jobtrack.application.entity.ApplicationStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationUpdateRequest {

  private ApplicationStatus status;
  private String notes;
  private String feedback;
}
