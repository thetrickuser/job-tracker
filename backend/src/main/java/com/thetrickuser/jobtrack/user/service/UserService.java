package com.thetrickuser.jobtrack.user.service;

import com.thetrickuser.jobtrack.user.dto.UserLoginRequest;
import com.thetrickuser.jobtrack.user.dto.UserRegisterRequest;
import com.thetrickuser.jobtrack.user.dto.AuthResponse;

public interface UserService {

  AuthResponse register(UserRegisterRequest request);

  AuthResponse login(UserLoginRequest request);
}
