package com.thetrickuser.jobtrack.security;

import java.util.Optional;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

@Slf4j
public class SecurityUtils {

  public static Optional<String> getCurrentUserEmail() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      log.debug("No authenticated user found in security context");
      return Optional.empty();
    }

    Object principal = authentication.getPrincipal();
    if (principal instanceof UserDetails) {
      String email = ((UserDetails) principal).getUsername();
      log.debug("Extracted user email from UserDetails: {}", email);
      return Optional.of(email);
    } else if (principal instanceof String) {
      log.debug("Extracted user email from String principal: {}", principal);
      return Optional.of((String) principal);
    }

    log.warn("Unknown principal type in authentication: {}", principal.getClass().getName());
    return Optional.empty();
  }
}
