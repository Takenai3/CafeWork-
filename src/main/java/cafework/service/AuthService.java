package cafework.service;

import cafework.dto.request.LoginRequest;
import cafework.dto.request.RegisterRequest;
import cafework.dto.request.VerifyOtpRequest;
import cafework.dto.response.AuthResponse;

public interface AuthService {
    void initiateRegistration(RegisterRequest request) throws Exception;
    AuthResponse verifyAndRegister(VerifyOtpRequest request, RegisterRequest registerData) throws Exception;
    AuthResponse login(LoginRequest request) throws Exception;
}
