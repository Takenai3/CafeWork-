package cafework.service;

import cafework.dto.SeatStatusUpdateRequest;
import cafework.dto.SeatStatusUpdateResponse;
import cafework.model.Cafe;
import cafework.repository.CafeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class CafeService {

    private static final List<String> VALID_SEAT_STATUSES = Arrays.asList(
            "AVAILABLE", "ALMOST_FULL", "FULL");

    @Autowired
    private CafeRepository cafeRepository;

    // === TÌM KIẾM THEO TÊN ===

    public List<Cafe> searchByName(String keyword) {
        System.out.println("--> Service đang xử lý từ khóa: [" + keyword + "]");
        if (keyword == null || keyword.trim().isEmpty()) {
            return cafeRepository.findAll();
        }
        return cafeRepository.findByNameContainingIgnoreCase(keyword.trim());
    }

    // === LẤY CHI TIẾT QUÁN THEO ID ===

    public Cafe getCafeDetailsById(String id) {
        System.out.println("--> Service đang lấy chi tiết quán có ID: [" + id + "]");
        Optional<Cafe> cafeOptional = cafeRepository.findById(id);
        return cafeOptional.orElse(null);
    }

    // === CẬP NHẬT TRẠNG THÁI CHỖ NGỒI ===

    public SeatStatusUpdateResponse updateSeatStatus(String cafeId, SeatStatusUpdateRequest request) {
        System.out.println("=========================================");
        System.out.println("--> updateSeatStatus được gọi");
        System.out.println("--> Cafe ID  : " + cafeId);
        System.out.println("--> New status: " + request.getSeatStatus());

        // Bước 1: Validate
        String newStatus = request.getSeatStatus();
        if (newStatus == null || newStatus.trim().isEmpty()) {
            throw new IllegalArgumentException("seatStatus không được để trống.");
        }
        if (!VALID_SEAT_STATUSES.contains(newStatus.toUpperCase())) {
            throw new IllegalArgumentException(
                    "seatStatus không hợp lệ: [" + newStatus + "]. "
                            + "Giá trị chấp nhận: AVAILABLE, ALMOST_FULL, FULL.");
        }

        // Bước 2: Tìm quán
        Optional<Cafe> cafeOptional = cafeRepository.findById(cafeId);
        if (cafeOptional.isEmpty()) {
            System.out.println("--> Không tìm thấy quán với ID: " + cafeId);
            return null;
        }

        // Bước 3: Cập nhật và lưu
        Cafe cafe = cafeOptional.get();
        String oldStatus = cafe.getSeatStatus();
        cafe.setSeatStatus(newStatus.toUpperCase());
        cafeRepository.save(cafe);

        System.out.println("--> Đã cập nhật: [" + oldStatus + "] → [" + cafe.getSeatStatus() + "]");
        System.out.println("=========================================");

        // Bước 4: Trả về response
        return new SeatStatusUpdateResponse(
                cafe.getId(),
                cafe.getName(),
                cafe.getSeatStatus(),
                "Trạng thái chỗ ngồi đã được cập nhật thành công.");
    }
}