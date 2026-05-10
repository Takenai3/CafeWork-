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

import cafework.model.Bookmark;
import cafework.repository.BookmarkRepository;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @GetMapping
    public List<Bookmark> getAllBookmarks() {
        return bookmarkRepository.findAll();
    }

    @GetMapping("/{id}")
    public Bookmark getBookmarkById(@PathVariable String id) {
        return bookmarkRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Bookmark createBookmark(@RequestBody Bookmark bookmark) {
        return bookmarkRepository.save(bookmark);
    }

    @PutMapping("/{id}")
    public Bookmark updateBookmark(@PathVariable String id, @RequestBody Bookmark bookmark) {
        bookmark.setId(id);
        return bookmarkRepository.save(bookmark);
    }

    @DeleteMapping("/{id}")
    public void deleteBookmark(@PathVariable String id) {
        bookmarkRepository.deleteById(id);
    }
}
