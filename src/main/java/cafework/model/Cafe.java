package cafework.model;

import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.Formula;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "cafes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cafe {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    
    @Column(name = "owner_name")
    private String ownerName;
    
    private String email;
    private String phone;
    
    @Column(name = "open_hours")
    private String openHours;
    
    private String address;
    private String description;
    
    @Column(name = "seat_status")
    private String seatStatus;

    @Formula("(SELECT COALESCE(AVG(r.rating), 0.0) FROM reviews r WHERE r.cafe_id = id)")
    private Double rating;     

    private Double latitude;   
    private Double longitude;  

    @Column(name = "owner_id")
    private UUID ownerId;

    @OneToOne
    @JoinColumn(name = "owner_id", insertable = false, updatable = false)
    @JsonIgnore
    private User owner;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "cafe_id", referencedColumnName = "id", insertable = false, updatable = false)
    private List<CafeImage> images;
}
