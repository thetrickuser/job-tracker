package com.thetrickuser.jobtrack.job.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.thetrickuser.jobtrack.job.entity.JobSource;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobResponse {

  private UUID id;
  private String title;
  private String company;
  private String jobUrl;
  private JobSource source;
  private String location;
  private Integer salaryMin;
  private Integer salaryMax;
  private String description;
  private String metadata;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
