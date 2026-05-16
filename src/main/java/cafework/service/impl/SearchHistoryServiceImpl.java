package cafework.service.impl;

import cafework.model.SearchHistory;
import cafework.service.SearchHistoryService;
import cafework.repository.SearchHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SearchHistoryServiceImpl implements SearchHistoryService {
    @Autowired
    private SearchHistoryRepository repository;

    @Override
    public void saveKeyword(
            String keyword,
            String userId
    ) {

        SearchHistory history = SearchHistory.builder()
                .keyword(keyword)
                .createdAt(LocalDateTime.now())
                .userId(UUID.fromString(userId))
                .build();

        repository.save(history);
    }

    @Override
    public List<SearchHistory> getHistory(String userId) {

        return repository
                .findByUserIdOrderByCreatedAtDesc(UUID.fromString(userId));
    }
}
