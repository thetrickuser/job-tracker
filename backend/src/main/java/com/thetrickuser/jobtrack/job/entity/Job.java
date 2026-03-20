package com.thetrickuser.jobtrack.job.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity 
@Table(name = "jobs", uniqueConstraints = { @UniqueConstraint(columnNames = "jobUrl")}) 
@Data 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder 
public class Job {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  private String title;

  private String company;

  private String jobUrl;

  @Enumerated(EnumType.STRING)
  private JobSource source;

  private String location;

  private Integer salaryMin;

  private Integer salaryMax;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Column(columnDefinition = "jsonb")
  private String metadata; // raw extracted data

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;
}