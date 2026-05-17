package cafework.service;

import cafework.model.SearchHistory;
import cafework.model.User;

import java.util.List;
import java.util.UUID;

public interface SearchHistoryService {
    void saveKeyword(String keyword, UUID userId);

    List<SearchHistory> getHistory(UUID userId);
}
