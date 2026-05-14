package cafework.model;

import java.util.List;

import org.hibernate.annotations.Formula;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table; // Bổ sung thư viện này

@Entity
@Table(name = "cafes")
public class Cafe {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;
    private String address;
    private String description;
    
    @Column(name = "seat_status")
    private String seatStatus;

    @Column(name = "open_hours")
    private String openHours;
    
    // Yêu cầu Database tự đếm trung bình cộng (AVG) của cột rating trong bảng reviews
    @Formula("(SELECT COALESCE(AVG(r.rating), 0.0) FROM reviews r WHERE r.cafe_id = id)")
    private Double rating;     

    private Double latitude;   
    private Double longitude;  

    @Column(name = "owner_id")
    private String ownerId;

    public Cafe() {
    }

    // --- GETTERS & SETTERS ---

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSeatStatus() {
        return seatStatus;
    }

    public void setSeatStatus(String seatStatus) {
        this.seatStatus = seatStatus;
    }

    public String getOpenHours() {
        return openHours;
    }

    public void setOpenHours(String openHours) {
        this.openHours = openHours;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "cafe_id", referencedColumnName = "id", insertable = false, updatable = false)
    private List<CafeImage> images;

    // Getter và Setter cho danh sách ảnh
    public List<CafeImage> getImages() {
        return images;
    }

    public void setImages(List<CafeImage> images) {
        this.images = images;
    }
}