package cafework.controller;

import cafework.model.SearchHistory;
import cafework.repository.SearchHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search-history")
public class SearchHistoryController {

    @Autowired
    private SearchHistoryRepository searchHistoryRepository;

    @GetMapping
    public List<SearchHistory> getAllSearchHistory() {
        return searchHistoryRepository.findAll();
    }

    @GetMapping("/{id}")
    public SearchHistory getSearchHistoryById(@PathVariable Integer id) {
        return searchHistoryRepository.findById(id).orElse(null);
    }

    @PostMapping
    public SearchHistory createSearchHistory(@RequestBody SearchHistory searchHistory) {
        return searchHistoryRepository.save(searchHistory);
    }

    @PutMapping("/{id}")
    public SearchHistory updateSearchHistory(@PathVariable Integer id, @RequestBody SearchHistory searchHistory) {
        searchHistory.setId(id);
        return searchHistoryRepository.save(searchHistory);
    }

    @DeleteMapping("/{id}")
    public void deleteSearchHistory(@PathVariable Integer id) {
        searchHistoryRepository.deleteById(id);
    }
}
