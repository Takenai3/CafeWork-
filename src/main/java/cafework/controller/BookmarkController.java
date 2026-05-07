package cafework.controller;

import cafework.model.Bookmark;
import cafework.repository.BookmarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public Bookmark getBookmarkById(@PathVariable Integer id) {
        return bookmarkRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Bookmark createBookmark(@RequestBody Bookmark bookmark) {
        return bookmarkRepository.save(bookmark);
    }

    @PutMapping("/{id}")
    public Bookmark updateBookmark(@PathVariable Integer id, @RequestBody Bookmark bookmark) {
        bookmark.setId(id);
        return bookmarkRepository.save(bookmark);
    }

    @DeleteMapping("/{id}")
    public void deleteBookmark(@PathVariable Integer id) {
        bookmarkRepository.deleteById(id);
    }
}
