package cafework.controller;

import cafework.model.Cafe;
import cafework.repository.CafeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cafes")
public class CafeController {

    @Autowired
    private CafeRepository cafeRepository;

    @GetMapping
    public List<Cafe> getAllCafes() {
        return cafeRepository.findAll();
    }

    @GetMapping("/{id}")
    public Cafe getCafeById(@PathVariable Integer id) {
        return cafeRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Cafe createCafe(@RequestBody Cafe cafe) {
        return cafeRepository.save(cafe);
    }

    @PutMapping("/{id}")
    public Cafe updateCafe(@PathVariable Integer id, @RequestBody Cafe cafe) {
        cafe.setId(id);
        return cafeRepository.save(cafe);
    }

    @DeleteMapping("/{id}")
    public void deleteCafe(@PathVariable Integer id) {
        cafeRepository.deleteById(id);
    }
}
