package com.thetrickuser.jobtrack.job.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thetrickuser.jobtrack.job.entity.Job;

@Repository
public interface JobRepository extends JpaRepository<Job, UUID> {

  Optional<Job> findByJobUrl(String jobUrl);

  boolean existsByJobUrl(String jobUrl);
}
