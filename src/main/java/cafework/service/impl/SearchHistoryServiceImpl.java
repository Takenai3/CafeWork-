package cafework.service.impl;

import cafework.model.SearchHistory;
import cafework.service.SearchHistoryService;
import cafework.repository.SearchHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SearchHistoryServiceImpl implements SearchHistoryService {
    @Autowired
    private SearchHistoryRepository repository;

    @Override
    public void saveKeyword(
            String keyword,
            UUID userId
    ) {
        Optional<SearchHistory> existing =
                repository.findByKeywordIgnoreCaseAndUserId(keyword, userId);

        if (existing.isPresent()) {
            SearchHistory history = existing.get();

            history.setCreatedAt(LocalDateTime.now());

            repository.save(history);
            return;
        }

        SearchHistory history = SearchHistory.builder()
                .keyword(keyword)
                .createdAt(LocalDateTime.now())
                .userId(userId)
                .build();

        repository.save(history);
    }

    @Override
    public List<SearchHistory> getHistory(UUID userId) {
        // System.out.println("[DEBUG_LOG] getHistory called for user: " + userId);
        List<SearchHistory> list = repository.findByUserIdOrderByCreatedAtDesc(userId);
        // System.out.println("[DEBUG_LOG] Repository returned " + list.size() + " items");
        return list;
    }
}
