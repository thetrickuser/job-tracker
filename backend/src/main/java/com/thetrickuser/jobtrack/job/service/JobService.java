package com.thetrickuser.jobtrack.job.service;

import java.util.List;
import java.util.UUID;

import com.thetrickuser.jobtrack.job.dto.JobRequest;
import com.thetrickuser.jobtrack.job.dto.JobResponse;

public interface JobService {

  JobResponse createJob(JobRequest jobRequest);

  List<JobResponse> getJobs();

  void deleteJobById(UUID jobId);
}
