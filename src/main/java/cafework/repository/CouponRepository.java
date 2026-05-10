package cafework.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cafework.model.Coupon;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, String> {
}
