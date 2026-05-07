package cafework.controller;

import cafework.model.Coupon;
import cafework.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    @Autowired
    private CouponRepository couponRepository;

    @GetMapping
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    @GetMapping("/{id}")
    public Coupon getCouponById(@PathVariable Integer id) {
        return couponRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Coupon createCoupon(@RequestBody Coupon coupon) {
        return couponRepository.save(coupon);
    }

    @PutMapping("/{id}")
    public Coupon updateCoupon(@PathVariable Integer id, @RequestBody Coupon coupon) {
        coupon.setId(id);
        return couponRepository.save(coupon);
    }

    @DeleteMapping("/{id}")
    public void deleteCoupon(@PathVariable Integer id) {
        couponRepository.deleteById(id);
    }
}
