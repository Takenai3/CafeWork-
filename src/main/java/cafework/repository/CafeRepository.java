package cafework.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cafework.model.Cafe;

@Repository
public interface CafeRepository extends JpaRepository<Cafe, String> {
    // Spring tự động tạo câu lệnh SQL tìm kiếm theo tên, bỏ qua viết hoa/thường
    List<Cafe> findByNameContainingIgnoreCase(String name);
}