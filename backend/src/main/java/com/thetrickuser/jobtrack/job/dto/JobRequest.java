package com.thetrickuser.jobtrack.job.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import com.thetrickuser.jobtrack.job.entity.JobSource;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class JobRequest {

  @NotBlank
  private String title;

  @NotBlank
  private String company;

  @NotBlank
  private String jobUrl;

  @NotNull
  private JobSource source;

  private String location;

  private Integer salaryMin;

  private Integer salaryMax;

  private String description;

  private String metadata;
}
