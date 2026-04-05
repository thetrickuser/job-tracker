package com.thetrickuser.jobtrack.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.thetrickuser.jobtrack.user.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
@Slf4j
public class JwtUtil {

  private final String jwtSecret;
  private final long jwtExpirationMinutes;

  public JwtUtil(@Value("${jwt.secret:changeitchangeitchangeitchangeitchangeit}") String jwtSecret,
      @Value("${jwt.expiration-minutes:1440}") long jwtExpirationMinutes) {
    this.jwtSecret = jwtSecret;
    this.jwtExpirationMinutes = jwtExpirationMinutes;
    log.info("JWT configuration initialized with expiration: {} minutes", jwtExpirationMinutes);
  }

  public String generateToken(User user) {
    Date now = Date.from(Instant.now());
    Date expiry = Date.from(Instant.now().plusSeconds(jwtExpirationMinutes * 60));

    String token = Jwts.builder()
        .setSubject(user.getEmail())
        .claim("userId", user.getId().toString())
        .setIssuedAt(now)
        .setExpiration(expiry)
        .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)), SignatureAlgorithm.HS256)
        .compact();

    log.debug("Generated JWT token for user: {} with expiry: {}", user.getEmail(), expiry);
    return token;
  }

  public String getEmailFromToken(String token) {
    try {
      Claims claims = Jwts.parserBuilder()
          .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
          .build()
          .parseClaimsJws(token)
          .getBody();
      String email = claims.getSubject();
      log.debug("Extracted email from token: {}", email);
      return email;
    } catch (Exception e) {
      log.warn("Failed to extract email from token", e);
      throw e;
    }
  }

  public boolean validateToken(String token) {
    try {
      Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8))).build()
          .parseClaimsJws(token);
      log.debug("Token validation successful");
      return true;
    } catch (Exception e) {
      log.warn("Token validation failed", e);
      return false;
    }
  }
}
