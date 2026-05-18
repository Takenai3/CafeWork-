package cafework.service;

import cafework.dto.SeatStatusUpdateRequest;
import cafework.dto.SeatStatusUpdateResponse;
import cafework.model.Cafe;

import java.util.List;

public interface CafeService {

    List<Cafe> searchByName(String keyword);

    Cafe getCafeDetailsById(String id);

    SeatStatusUpdateResponse updateSeatStatus(
            String cafeId,
            SeatStatusUpdateRequest request
    );
}