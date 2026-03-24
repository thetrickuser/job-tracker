package com.thetrickuser.jobtrack.user.service.impl;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.thetrickuser.jobtrack.security.UserPrincipal;
import com.thetrickuser.jobtrack.user.entity.User;
import com.thetrickuser.jobtrack.user.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;

  public CustomUserDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    Optional<User> optional = userRepository.findByEmail(email);
    User user = optional.orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    return new UserPrincipal(user);
  }
}
