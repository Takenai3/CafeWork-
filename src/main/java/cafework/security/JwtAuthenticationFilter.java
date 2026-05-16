package cafework.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.context.annotation.Lazy;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Lazy // Để tránh vòng lặp phụ thuộc giữa JwtAuthenticationFilter và UserDetailsServiceImpl
    @Autowired
    private UserDetailsService userDetailsService; 

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // 1. Lục soát hành lý xem có mang theo Thẻ bài (Authorization header) không
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // Nếu không có thẻ bài, hoặc thẻ bài không bắt đầu bằng "Bearer ", thì cho đi tiếp (Cấm Vệ Quân phía sau sẽ đuổi nếu vào khu vực cấm)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Tịch thu thẻ bài (Bỏ đi 7 chữ "Bearer " ở đầu)
        jwt = authHeader.substring(7);
        
        // 3. Dùng cẩm nang JwtUtil để đọc tên (email) từ thẻ bài
        userEmail = jwtUtil.extractEmail(jwt);

        // 4. Nếu đọc được tên và người này chưa được Cấm Vệ Quân ghi nhận
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            // Trích xuất thông tin chi tiết của bá tánh từ Database
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // Xác minh xem thẻ bài có phải là hàng giả hoặc hết hạn không
            if (jwtUtil.validateToken(jwt, userDetails.getUsername())) {
                
                // Nếu thẻ bài hợp lệ, cấp "Giấy thông hành" chính thức cho Cấm Vệ Quân
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // Ghi danh bá tánh vào sổ đỏ của Security
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        // Mở cổng cho đi tiếp vào các hàm bên trong (Controller)
        filterChain.doFilter(request, response);
    }
}