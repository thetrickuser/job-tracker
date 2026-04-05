package com.thetrickuser.jobtrack.application.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.thetrickuser.jobtrack.job.entity.Job;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "applications", uniqueConstraints = @UniqueConstraint(columnNames = { "user_id", "job_id" }))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private com.thetrickuser.jobtrack.user.entity.User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    private LocalDateTime appliedAt;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
