package com.thetrickuser.jobtrack.application.service;

import java.util.List;
import java.util.UUID;

import com.thetrickuser.jobtrack.application.dto.ApplicationResponse;
import com.thetrickuser.jobtrack.application.dto.ApplicationUpdateRequest;
import com.thetrickuser.jobtrack.job.dto.JobRequest;

public interface ApplicationService {

  ApplicationResponse createApplication(JobRequest jobRequest, String userEmail);

  List<ApplicationResponse> getUserApplications(String userEmail);

  ApplicationResponse updateApplication(UUID applicationId, ApplicationUpdateRequest request, String userEmail);

  void deleteApplication(UUID applicationId, String userEmail);
}
