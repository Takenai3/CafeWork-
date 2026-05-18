package cafework.controller;

import cafework.dto.request.LoginRequest;
import cafework.dto.request.RegisterRequest;
import cafework.dto.request.VerifyOtpRequest;
import cafework.dto.response.AuthResponse;
import cafework.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Temporary storage for register data between steps
    private final Map<String, RegisterRequest> pendingRegistrations = new HashMap<>();

    @PostMapping("/signup/initiate")
    public ResponseEntity<?> initiateSignup(@Valid @RequestBody RegisterRequest request) {
        try {
            authService.initiateRegistration(request);
            pendingRegistrations.put(request.getEmail(), request);
            return ResponseEntity.ok("OTP sent to your email.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/signup/verify")
    public ResponseEntity<?> verifySignup(@Valid @RequestBody VerifyOtpRequest request) {
        try {
            RegisterRequest registerData = pendingRegistrations.get(request.getEmail());
            if (registerData == null) {
                return ResponseEntity.badRequest().body("No pending registration found for this email.");
            }
            AuthResponse response = authService.verifyAndRegister(request, registerData);
            pendingRegistrations.remove(request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
