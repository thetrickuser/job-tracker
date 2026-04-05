package com.thetrickuser.jobtrack.application.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thetrickuser.jobtrack.application.entity.Application;
import com.thetrickuser.jobtrack.job.entity.Job;
import com.thetrickuser.jobtrack.user.entity.User;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, UUID> {

  List<Application> findAllByUser(User user);

  Optional<Application> findByIdAndUser(UUID id, User user);

  boolean existsByUserAndJob(User user, Job job);
}
