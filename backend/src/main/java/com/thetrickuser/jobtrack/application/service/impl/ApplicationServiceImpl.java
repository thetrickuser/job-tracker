package com.thetrickuser.jobtrack.application.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.thetrickuser.jobtrack.application.dto.ApplicationResponse;
import com.thetrickuser.jobtrack.application.dto.ApplicationUpdateRequest;
import com.thetrickuser.jobtrack.application.entity.Application;
import com.thetrickuser.jobtrack.application.entity.ApplicationStatus;
import com.thetrickuser.jobtrack.application.mapper.ApplicationMapper;
import com.thetrickuser.jobtrack.application.repository.ApplicationRepository;
import com.thetrickuser.jobtrack.application.service.ApplicationService;
import com.thetrickuser.jobtrack.job.dto.JobRequest;
import com.thetrickuser.jobtrack.job.entity.Job;
import com.thetrickuser.jobtrack.job.service.JobService;
import com.thetrickuser.jobtrack.user.entity.User;
import com.thetrickuser.jobtrack.user.repository.UserRepository;

@Service
public class ApplicationServiceImpl implements ApplicationService {

  private final ApplicationRepository applicationRepository;
  private final ApplicationMapper applicationMapper;
  private final JobService jobService;
  private final UserRepository userRepository;

  public ApplicationServiceImpl(ApplicationRepository applicationRepository, ApplicationMapper applicationMapper,
      JobService jobService, UserRepository userRepository) {
    this.applicationRepository = applicationRepository;
    this.applicationMapper = applicationMapper;
    this.jobService = jobService;
    this.userRepository = userRepository;
  }

  @Override
  @Transactional
  public ApplicationResponse createApplication(JobRequest jobRequest, String userEmail) {
    User user = userRepository.findByEmail(userEmail)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

    Job job = jobService.findOrCreateJobEntity(jobRequest);

    if (applicationRepository.existsByUserAndJob(user, job)) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Application already exists for this job");
    }

    Application application = Application.builder()
        .user(user)
        .job(job)
        .status(ApplicationStatus.SAVED)
        .createdAt(LocalDateTime.now())
        .updatedAt(LocalDateTime.now())
        .build();

    Application saved = applicationRepository.save(application);
    return applicationMapper.toResponse(saved);
  }

  @Override
  public List<ApplicationResponse> getUserApplications(String userEmail) {
    User user = userRepository.findByEmail(userEmail)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

    List<Application> applications = applicationRepository.findAllByUser(user);
    return applications.stream().map(applicationMapper::toResponse).toList();
  }

  @Override
  @Transactional
  public ApplicationResponse updateApplication(UUID applicationId, ApplicationUpdateRequest request, String userEmail) {
    User user = userRepository.findByEmail(userEmail)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

    Application application = applicationRepository.findByIdAndUser(applicationId, user)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

    if (request.getStatus() != null) {
      if (application.getStatus() == ApplicationStatus.SAVED && request.getStatus() == ApplicationStatus.APPLIED) {
        application.setAppliedAt(LocalDateTime.now());
      }
      application.setStatus(request.getStatus());
    }

    if (request.getNotes() != null) {
      application.setNotes(request.getNotes());
    }
    if (request.getFeedback() != null) {
      application.setFeedback(request.getFeedback());
    }

    application.setUpdatedAt(LocalDateTime.now());

    Application updated = applicationRepository.save(application);
    return applicationMapper.toResponse(updated);
  }

  @Override
  @Transactional
  public void deleteApplication(UUID applicationId, String userEmail) {
    User user = userRepository.findByEmail(userEmail)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

    Application application = applicationRepository.findByIdAndUser(applicationId, user)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

    applicationRepository.delete(application);
  }
}
