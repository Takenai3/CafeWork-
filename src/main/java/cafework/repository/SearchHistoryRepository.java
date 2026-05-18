package cafework.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cafework.model.SearchHistory;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, UUID> {
    List<SearchHistory> findByUserIdOrderByCreatedAtDesc(UUID userId);
    Optional<SearchHistory> findByKeywordIgnoreCaseAndUserId(
            String keyword,
            UUID userId
    );
}

