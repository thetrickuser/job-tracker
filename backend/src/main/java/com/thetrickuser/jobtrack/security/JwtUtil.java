package com.thetrickuser.jobtrack.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.thetrickuser.jobtrack.user.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

  private final String jwtSecret;
  private final long jwtExpirationMinutes;

  public JwtUtil(@Value("${jwt.secret:changeitchangeitchangeitchangeitchangeit}") String jwtSecret,
      @Value("${jwt.expiration-minutes:1440}") long jwtExpirationMinutes) {
    this.jwtSecret = jwtSecret;
    this.jwtExpirationMinutes = jwtExpirationMinutes;
  }

  public String generateToken(User user) {
    Date now = Date.from(Instant.now());
    Date expiry = Date.from(Instant.now().plusSeconds(jwtExpirationMinutes * 60));

    return Jwts.builder()
        .setSubject(user.getEmail())
        .claim("userId", user.getId().toString())
        .setIssuedAt(now)
        .setExpiration(expiry)
        .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)), SignatureAlgorithm.HS256)
        .compact();
  }

  public String getEmailFromToken(String token) {
    Claims claims = Jwts.parserBuilder()
        .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
        .build()
        .parseClaimsJws(token)
        .getBody();
    return claims.getSubject();
  }

  public boolean validateToken(String token) {
    try {
      Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8))).build()
          .parseClaimsJws(token);
      return true;
    } catch (Exception e) {
      return false;
    }
  }
}
