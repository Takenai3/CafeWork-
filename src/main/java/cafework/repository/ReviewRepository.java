package cafework.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cafework.model.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
}
