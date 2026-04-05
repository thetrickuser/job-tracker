package com.thetrickuser.jobtrack.user.service.impl;

import java.util.Optional;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.thetrickuser.jobtrack.security.UserPrincipal;
import com.thetrickuser.jobtrack.user.entity.User;
import com.thetrickuser.jobtrack.user.repository.UserRepository;

@Service
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;

  public CustomUserDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    log.debug("Loading user details for email: {}", email);

    Optional<User> optional = userRepository.findByEmail(email);
    User user = optional.orElseThrow(() -> {
      log.warn("User not found for email: {}", email);
      return new UsernameNotFoundException("User not found: " + email);
    });

    log.debug("User details loaded successfully for email: {}", email);
    return new UserPrincipal(user);
  }
}
