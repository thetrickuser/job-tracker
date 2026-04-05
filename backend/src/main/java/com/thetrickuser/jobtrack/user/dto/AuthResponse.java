package com.thetrickuser.jobtrack.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

  private String token;
  @lombok.Builder.Default
  private String tokenType = "Bearer";
  private String email;
  private String name;
}
