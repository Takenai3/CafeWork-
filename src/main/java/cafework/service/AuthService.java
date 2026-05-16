package cafework.service;

import cafework.dto.request.LoginRequest;
import cafework.dto.request.RegisterRequest;
import cafework.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse registerDirectly(RegisterRequest request) throws Exception;
    AuthResponse login(LoginRequest request) throws Exception;
}
