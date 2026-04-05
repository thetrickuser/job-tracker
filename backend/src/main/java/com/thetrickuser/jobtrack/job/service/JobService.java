package com.thetrickuser.jobtrack.job.service;

import java.util.List;
import java.util.UUID;

import com.thetrickuser.jobtrack.job.dto.JobRequest;
import com.thetrickuser.jobtrack.job.dto.JobResponse;

public interface JobService {

  JobResponse createJob(JobRequest jobRequest);

  JobResponse findOrCreateJob(JobRequest jobRequest);

  com.thetrickuser.jobtrack.job.entity.Job findOrCreateJobEntity(JobRequest jobRequest);

  List<JobResponse> getJobs();

  void deleteJobById(UUID jobId);
}
