package cafework.controller;

import cafework.dto.request.ProfileUpdateRequest;
import cafework.dto.response.ProfileResponse;
import cafework.model.Cafe;
import cafework.model.User;
import cafework.repository.CafeRepository;
import cafework.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CafeRepository cafeRepository;

    // Lấy thông tin người dùng đang đăng nhập
    @GetMapping
    public ResponseEntity<ProfileResponse> getMyProfile() {
        // Lấy email từ token của người dùng đang đăng nhập (Spring Security)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();

        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        ProfileResponse.ProfileResponseBuilder responseBuilder = ProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name());

        // Nếu là chủ quán, lấy thêm thông tin quán Cafe
        if (user.getRole() == User.Role.OWNER) {
            Optional<Cafe> cafeOpt = cafeRepository.findByOwnerId(user.getId());
            if (cafeOpt.isPresent()) {
                Cafe cafe = cafeOpt.get();
                responseBuilder
                        .cafeName(cafe.getName())
                        .phone(cafe.getPhone())
                        .openHours(cafe.getOpenHours())
                        .address(cafe.getAddress());
            }
        }

        return ResponseEntity.ok(responseBuilder.build());
    }

    // Cập nhật thông tin người dùng đang đăng nhập
    @PutMapping
    public ResponseEntity<?> updateMyProfile(@RequestBody ProfileUpdateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();

        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // 1. Cập nhật thông tin User cơ bản
        if (request.getFullName() != null && !request.getFullName().isEmpty()) {
            user.setFullName(request.getFullName());
            userRepository.save(user);
        }

        // 2. Nếu là Owner, cập nhật thêm thông tin quán
        if (user.getRole() == User.Role.OWNER) {
            Cafe cafe = cafeRepository.findByOwnerId(user.getId())
                    .orElseGet(() -> {
                        // Nếu Owner chưa có quán, tạo mới 1 entity Cafe
                        Cafe newCafe = new Cafe();
                        newCafe.setOwnerId(user.getId());
                        newCafe.setOwnerName(request.getFullName());
                        newCafe.setEmail(user.getEmail()); // Lấy email chủ quán làm email quán
                        return newCafe;
                    });

            if (request.getCafeName() != null)
                cafe.setName(request.getCafeName());
            if (request.getPhone() != null)
                cafe.setPhone(request.getPhone());
            if (request.getOpenHours() != null)
                cafe.setOpenHours(request.getOpenHours());
            if (request.getAddress() != null)
                cafe.setAddress(request.getAddress());

            cafeRepository.save(cafe);
        }

        return ResponseEntity.ok("Cập nhật thông tin hồ sơ thành công!");
    }
}