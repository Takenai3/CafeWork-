package cafework.controller;

import java.util.List;
import java.util.UUID;

import cafework.model.User;
import cafework.repository.UserRepository;
import cafework.security.SecurityUtils;
import cafework.service.SearchHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cafework.model.SearchHistory;
import cafework.repository.SearchHistoryRepository;

@RestController
@RequestMapping("/api/search-history")
public class SearchHistoryController {

    @Autowired
    private SearchHistoryRepository searchHistoryRepository;

    @Autowired
    private SearchHistoryService searchHistoryService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Lấy lịch sử tìm kiếm của người dùng hiện tại.
     */
    @GetMapping
    public ResponseEntity<?> getMySearchHistory() {
        String email = SecurityUtils.getCurrentUserEmail();
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User must be logged in.");
        }

        User user = userRepository.findByEmailIgnoreCase(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        List<SearchHistory> history = searchHistoryService.getHistory(user.getId().toString());
        return ResponseEntity.ok(history);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SearchHistory> getSearchHistoryById(@PathVariable UUID id) {
        return searchHistoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSearchHistory(@PathVariable UUID id) {
        if (!searchHistoryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        searchHistoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
