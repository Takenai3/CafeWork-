package cafework.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cafework.model.Bookmark;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, String> {
}
