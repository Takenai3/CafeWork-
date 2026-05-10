package cafework.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cafework.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
}
