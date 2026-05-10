package cafework.service;

import cafework.model.Cafe;
import cafework.repository.CafeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CafeService {

    @Autowired
    private CafeRepository cafeRepository;

    public List<Cafe> searchByName(String keyword) {
        System.out.println("--> Service đang xử lý từ khóa: [" + keyword + "]");

        if (keyword == null || keyword.trim().isEmpty()) {
            return cafeRepository.findAll();
        }
        return cafeRepository.findByNameContainingIgnoreCase(keyword.trim());
    }

    public Cafe getCafeDetailsById(String id) {
        System.out.println("--> Service đang lấy chi tiết quán có ID: [" + id + "]");
        Optional<Cafe> cafeOptional = cafeRepository.findById(id);

        // Trả về đối tượng Cafe nếu tìm thấy, ngược lại trả về null
        return cafeOptional.orElse(null);
    }
}