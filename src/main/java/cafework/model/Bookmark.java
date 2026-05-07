package cafework.model;

import jakarta.persistence.*;

@Entity
@Table(name = "bookmarks")
public class Bookmark {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer userId;
    private Integer cafeId;

    public Bookmark() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getCafeId() {
        return cafeId;
    }

    public void setCafeId(Integer cafeId) {
        this.cafeId = cafeId;
    }
}
