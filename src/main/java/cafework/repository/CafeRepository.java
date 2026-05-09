package cafework.repository;

import cafework.model.Cafe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CafeRepository extends JpaRepository<Cafe, Integer> {
    // Spring tự động tạo câu lệnh SQL tìm kiếm theo tên, bỏ qua viết hoa/thường
    List<Cafe> findByNameContainingIgnoreCase(String name);
}