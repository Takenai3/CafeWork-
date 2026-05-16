package cafework.service.impl;

import cafework.dto.request.LoginRequest;
import cafework.dto.request.RegisterRequest;
import cafework.dto.response.AuthResponse;
import cafework.model.User;
import cafework.repository.UserRepository;
import cafework.security.JwtUtil;
import cafework.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public AuthResponse registerDirectly(RegisterRequest request) throws Exception {
        // 1. Check if user already exists
        if (userRepository.findByEmailIgnoreCase(request.getEmail()).isPresent()) {
            throw new Exception("Email already registered!");
        }

        // 2. Map role
        User.Role role = User.Role.USER;
        if (request.getRole() != null) {
            try {
                role = User.Role.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        // 3. Save User (Plain-text password)
        User user = User.builder()
                .email(request.getEmail())
                .password(request.getPassword()) // Plain text as requested
                .fullName(request.getFullName())
                .role(role)
                .build();
        
        user = userRepository.save(user);

        // 4. Generate Token and return response
        String token = jwtUtil.generateToken(user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) throws Exception {
        System.out.println("Email nhận được: " + request.getEmail());
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new Exception("User not found!"));

        System.out.println("Mật khẩu trong DB: " + user.getPassword());
        System.out.println("Mật khẩu từ Client: " + request.getPassword());

        // Plain text comparison with trim
        if (!request.getPassword().trim().equals(user.getPassword().trim())) {
            throw new Exception("Invalid password!");
        }

        System.out.println("Login thành công cho user: " + user.getEmail());
        String token = jwtUtil.generateToken(user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }
}
