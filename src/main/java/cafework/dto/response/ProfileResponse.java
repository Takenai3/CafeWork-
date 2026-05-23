package cafework.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class ProfileResponse {
    private UUID id;
    private String email;
    private String fullName;
    private String role;

    // Các trường dành riêng cho Owner (nếu là USER thì các trường này sẽ null)
    private String cafeName;
    private String phone;
    private String openHours;
    private String address;
}