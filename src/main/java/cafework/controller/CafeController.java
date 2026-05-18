package cafework.controller;

import java.util.List;

import cafework.dto.SeatStatusUpdateRequest;
import cafework.dto.SeatStatusUpdateResponse;
import cafework.service.SearchHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cafework.model.Cafe;
import cafework.repository.CafeRepository;
import cafework.service.CafeService;

@RestController
@RequestMapping("/api/cafes")
@CrossOrigin(origins = "http://localhost:5173")
public class CafeController {

    @Autowired
    private CafeRepository cafeRepository;

    @Autowired
    private CafeService cafeService;
    @Autowired
    private SearchHistoryService searchHistoryService;

    // === CÁC API CƠ BẢN ===

    @GetMapping
    public List<Cafe> getAllCafes() {
        return cafeRepository.findAll();
    }

    @PostMapping
    public Cafe createCafe(@RequestBody Cafe cafe) {
        return cafeRepository.save(cafe);
    }

    @PutMapping("/{id}")
    public Cafe updateCafe(@PathVariable String id, @RequestBody Cafe cafe) {
        cafe.setId(id);
        return cafeRepository.save(cafe);
    }

    @DeleteMapping("/{id}")
    public void deleteCafe(@PathVariable String id) {
        cafeRepository.deleteById(id);
    }

    // === API TÌM KIẾM ===

    @GetMapping("/search")
    public ResponseEntity<List<Cafe>> searchCafes(
            @RequestParam(value = "keyword", required = false, defaultValue = "") String keyword) {
        System.out.println("=========================================");
        System.out.println("--> API /search vừa được gọi!");
        System.out.println("--> Từ khóa: [" + keyword + "]");
        List<Cafe> results = cafeService.searchByName(keyword);
        System.out.println("--> Tìm thấy " + results.size() + " quán.");
        System.out.println("=========================================");
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cafe> getCafeById(@PathVariable String id) {
        System.out.println("--> API GET /api/cafes/" + id + " được gọi!");
        Cafe cafe = cafeService.getCafeDetailsById(id);
        if (cafe != null) {
            return ResponseEntity.ok(cafe);
        } else {
            System.out.println("--> Không tìm thấy quán ID: " + id);
            return ResponseEntity.notFound().build();
        }
    }

    // ===================================================================
    // [ID.4 - No.13] API ĐỒNG BỘ TRẠNG THÁI CHỖ NGỒI TỪ MÀN HÌNH CHỦ QUÁN
    // ===================================================================
    /**
     * PATCH /api/cafes/{id}/seat-status
     *
     * Mục đích: Chủ quán (OWNER) cập nhật trạng thái chỗ ngồi từ màn hình quản lý
     * (ID.4).
     *
     * Request Body (JSON):
     * {
     * "seatStatus": "AVAILABLE" // hoặc "ALMOST_FULL" hoặc "FULL"
     * }
     *
     * Response thành công (200 OK):
     * {
     * "cafeId": "...",
     * "cafeName": "...",
     * "seatStatus": "AVAILABLE",
     * "message": "Trạng thái chỗ ngồi đã được cập nhật thành công."
     * }
     *
     * Mapping hiển thị (theo bản đặc tả):
     * AVAILABLE → 空席あり → Badge màu xanh lá
     * ALMOST_FULL → 残りわずか → Badge màu vàng
     * FULL → 満席 → Badge màu đỏ
     *
     * Luồng xử lý:
     * FE (màn hình ID.4) → PATCH API → CafeService.updateSeatStatus() → DB → 200 OK
     * Người dùng refresh màn hình ID.2 (Chi tiết quán) → GET /api/cafes/{id} → thấy
     * trạng thái mới
     */
    @PatchMapping("/{id}/seat-status")
    public ResponseEntity<?> updateSeatStatus(
            @PathVariable String id,
            @RequestBody SeatStatusUpdateRequest request) {

        System.out.println("--> API PATCH /api/cafes/" + id + "/seat-status được gọi!");

        try {
            SeatStatusUpdateResponse response = cafeService.updateSeatStatus(id, request);

            if (response == null) {
                // Quán không tồn tại
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Không tìm thấy quán cafe với ID: " + id);
            }

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            // seatStatus không hợp lệ
            System.out.println("--> Lỗi validate: " + e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            // Lỗi hệ thống không mong muốn
            System.out.println("--> Lỗi hệ thống: " + e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Đã xảy ra lỗi khi cập nhật trạng thái.");
        }
    }
}