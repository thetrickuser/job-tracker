package com.thetrickuser.jobtrack.application.mapper;

import org.springframework.stereotype.Component;

import com.thetrickuser.jobtrack.application.dto.ApplicationResponse;
import com.thetrickuser.jobtrack.application.entity.Application;
import com.thetrickuser.jobtrack.job.mapper.JobMapper;

@Component
public class ApplicationMapper {

  private final JobMapper jobMapper;

  public ApplicationMapper(JobMapper jobMapper) {
    this.jobMapper = jobMapper;
  }

  public ApplicationResponse toResponse(Application application) {
    if (application == null) {
      return null;
    }

    return ApplicationResponse.builder()
        .id(application.getId())
        .job(jobMapper.toResponse(application.getJob()))
        .status(application.getStatus())
        .appliedAt(application.getAppliedAt())
        .notes(application.getNotes())
        .feedback(application.getFeedback())
        .createdAt(application.getCreatedAt())
        .updatedAt(application.getUpdatedAt())
        .build();
  }
}
