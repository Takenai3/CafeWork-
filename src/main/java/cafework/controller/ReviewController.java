package cafework.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import cafework.model.User;
import cafework.model.Review;
import cafework.repository.ReviewRepository;
import cafework.repository.UserRepository;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;
    @GetMapping
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @GetMapping("/{id}")
    public Review getReviewById(@PathVariable String id) {
        return reviewRepository.findById(id).orElse(null);
    }

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody Review requestReview) {
        try {
            // 1. NHÁT KIẾM CHÍ MẠNG: Lấy Thẻ bài đang được Cấm Vệ Quân giữ trên tay
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName(); // Đây chính là email của ngài

            // 2. Tra sổ Nam Tào để lấy chính xác bản thể của ngài trong Database
            User currentUser = userRepository.findByEmail(currentUserEmail)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

            // 3. ĐÓNG DẤU CHỦ QUYỀN: Gắn ngài vào làm tác giả của tờ Review này
            requestReview.setUserId(currentUser.getId().toString()); 
            
            // (Nếu ngài dùng DTO thay vì Entity trực tiếp, ngài hãy set User vào Entity Review trước khi save)

            // 4. Nộp tấu chương vào kho
            Review savedReview = reviewRepository.save(requestReview);
            
            return ResponseEntity.ok(savedReview);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public Review updateReview(@PathVariable String id, @RequestBody Review review) {
        review.setId(id);
        return reviewRepository.save(review);
    }

    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable String id) {
        reviewRepository.deleteById(id);
    }
}
