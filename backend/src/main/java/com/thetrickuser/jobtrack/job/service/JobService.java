package com.thetrickuser.jobtrack.job.service;

import com.thetrickuser.jobtrack.job.dto.JobRequest;
import com.thetrickuser.jobtrack.job.dto.JobResponse;

public interface JobService {

  JobResponse createJob(JobRequest jobRequest);
}
