package cafework.dto.request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CafeRequest {
    private String name;
    private String ownerName;
    private String email;
    private String phone;
    private String openHours;
    private String address;
    private Double latitude;
    private Double longitude;
    private String description;
}
