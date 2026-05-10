package cafework.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cafework.model.Cafe;
import cafework.repository.CafeRepository;
import cafework.service.CafeService;

@RestController
@RequestMapping("/api/cafes")
@CrossOrigin(origins = "http://localhost:5173") // Rất quan trọng: Cho phép Frontend React truy cập API
public class CafeController {

    @Autowired
    private CafeRepository cafeRepository;

    @Autowired
    private CafeService cafeService; // Gọi thêm Service để xử lý logic tìm kiếm

    // === CÁC API CƠ BẢN (ĐÃ CÓ SẴN) ===

    @GetMapping
    public List<Cafe> getAllCafes() {
        return cafeRepository.findAll();
    }

    @GetMapping("/{id}")
    public Cafe getCafeById(@PathVariable String id) {
        return cafeRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Cafe createCafe(@RequestBody Cafe cafe) {
        return cafeRepository.save(cafe);
    }

    @PutMapping("/{id}")
    public Cafe updateCafe(@PathVariable String id, @RequestBody Cafe cafe) {
        cafe.setId(id);
        return cafeRepository.save(cafe);
    }

    @DeleteMapping("/{id}")
    public void deleteCafe(@PathVariable String id) {
        cafeRepository.deleteById(id);
    }

    // === TÍNH NĂNG MỚI BỔ SUNG ===

    // API Tìm kiếm quán cafe theo từ khóa
    @GetMapping("/search")
    public ResponseEntity<List<Cafe>> searchCafes(@RequestParam(value = "keyword", required = false, defaultValue = "") String keyword) {
        System.out.println("=========================================");
        System.out.println("--> API /search vừa được gọi từ Frontend!");
        System.out.println("--> Từ khóa nhận được: [" + keyword + "]");
        
        List<Cafe> results = cafeService.searchByName(keyword);
        
        System.out.println("--> Đã tìm thấy " + results.size() + " quán cafe trong Database.");
        System.out.println("=========================================");
        
        return ResponseEntity.ok(results);
    }
}