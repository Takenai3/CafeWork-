package cafework.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cafework.model.SearchHistory;
import cafework.repository.SearchHistoryRepository;

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
    public SearchHistory getSearchHistoryById(@PathVariable String id) {
        return searchHistoryRepository.findById(id).orElse(null);
    }

    @PostMapping
    public SearchHistory createSearchHistory(@RequestBody SearchHistory searchHistory) {
        return searchHistoryRepository.save(searchHistory);
    }

    @PutMapping("/{id}")
    public SearchHistory updateSearchHistory(@PathVariable String id, @RequestBody SearchHistory searchHistory) {
        searchHistory.setId(id);
        return searchHistoryRepository.save(searchHistory);
    }

    @DeleteMapping("/{id}")
    public void deleteSearchHistory(@PathVariable String id) {
        searchHistoryRepository.deleteById(id);
    }
}
