package cafework.service; // Bệ hạ có thể đổi tên package tùy ý nơi ngài đặt file

import cafework.model.User; // Đã trỏ đúng vào kho chứa model của bệ hạ
import cafework.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Dùng chính hàm findByEmail trong UserRepository của bệ hạ để tìm kiếm
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy bá tánh có email: " + email));

        // 2. Chuyển đổi dữ liệu sang chuẩn UserDetails để Cấm Vệ Quân đọc được
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                new ArrayList<>() // Danh sách quyền hạn, tạm thời để trống
        );
    }
}