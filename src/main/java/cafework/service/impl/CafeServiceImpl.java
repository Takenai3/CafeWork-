package cafework.service.impl;

import cafework.dto.SeatStatusUpdateRequest;
import cafework.dto.SeatStatusUpdateResponse;
import cafework.model.Cafe;
import cafework.repository.CafeRepository;
import cafework.repository.UserRepository;
import cafework.security.SecurityUtils;
import cafework.service.CafeService;
import cafework.service.SearchHistoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class CafeServiceImpl implements CafeService {

    private static final List<String> VALID_SEAT_STATUSES =
            Arrays.asList(
                    "AVAILABLE",
                    "ALMOST_FULL",
                    "FULL"
            );

    @Autowired
    private CafeRepository cafeRepository;

    @Autowired
    private SearchHistoryService searchHistoryService;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Cafe> searchByName(String keyword) {

        System.out.println(
                "--> Service đang xử lý từ khóa: ["
                        + keyword + "]"
        );

        // Tự động lưu lịch sử tìm kiếm
        String email =
                SecurityUtils.getCurrentUserEmail();

        if (email != null
                && keyword != null
                && !keyword.trim().isEmpty()) {

            userRepository
                    .findByEmailIgnoreCase(email)
                    .ifPresent(user -> {

                        searchHistoryService.saveKeyword(
                                keyword.trim(),
                                user.getId().toString()
                        );

                        System.out.println(
                                "--> Đã lưu lịch sử tìm kiếm cho user: "
                                        + email
                        );
                    });
        }

        if (keyword == null
                || keyword.trim().isEmpty()) {

            return cafeRepository.findAll();
        }

        return cafeRepository
                .findByNameContainingIgnoreCase(
                        keyword.trim()
                );
    }

    @Override
    public Cafe getCafeDetailsById(String id) {

        System.out.println(
                "--> Service đang lấy chi tiết quán có ID: ["
                        + id + "]"
        );

        Optional<Cafe> cafeOptional =
                cafeRepository.findById(id);

        return cafeOptional.orElse(null);
    }

    @Override
    public SeatStatusUpdateResponse updateSeatStatus(
            String cafeId,
            SeatStatusUpdateRequest request
    ) {

        System.out.println(
                "========================================="
        );

        System.out.println(
                "--> [ID.4] updateSeatStatus được gọi"
        );

        System.out.println(
                "--> Cafe ID : " + cafeId
        );

        System.out.println(
                "--> New status: "
                        + request.getSeatStatus()
        );

        String newStatus =
                request.getSeatStatus();

        if (newStatus == null
                || newStatus.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "seatStatus không được để trống."
            );
        }

        if (!VALID_SEAT_STATUSES.contains(
                newStatus.toUpperCase()
        )) {

            throw new IllegalArgumentException(
                    "seatStatus không hợp lệ: ["
                            + newStatus
                            + "]. Giá trị chấp nhận: "
                            + "AVAILABLE, ALMOST_FULL, FULL."
            );
        }

        Optional<Cafe> cafeOptional =
                cafeRepository.findById(cafeId);

        if (cafeOptional.isEmpty()) {

            System.out.println(
                    "--> Không tìm thấy quán với ID: "
                            + cafeId
            );

            return null;
        }

        Cafe cafe = cafeOptional.get();

        String oldStatus =
                cafe.getSeatStatus();

        cafe.setSeatStatus(
                newStatus.toUpperCase()
        );

        cafeRepository.save(cafe);

        System.out.println(
                "--> Đã cập nhật: ["
                        + oldStatus
                        + "] → ["
                        + cafe.getSeatStatus()
                        + "]"
        );

        System.out.println(
                "========================================="
        );

        return new SeatStatusUpdateResponse(
                cafe.getId(),
                cafe.getName(),
                cafe.getSeatStatus(),
                "Trạng thái chỗ ngồi đã được cập nhật thành công."
        );
    }
}