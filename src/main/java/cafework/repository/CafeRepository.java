package cafework.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cafework.model.Cafe;

@Repository
public interface CafeRepository extends JpaRepository<Cafe, UUID> {
    List<Cafe> findByNameContainingIgnoreCase(String name);
    Optional<Cafe> findByOwnerId(UUID ownerId);
}
