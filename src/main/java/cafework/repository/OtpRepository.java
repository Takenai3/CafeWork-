package cafework.repository;

import cafework.model.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OtpRepository extends JpaRepository<Otp, UUID> {
    Optional<Otp> findByEmailAndOtpCodeAndIsUsedFalseAndExpiresAtAfter(
            String email, String otpCode, LocalDateTime now);
}
