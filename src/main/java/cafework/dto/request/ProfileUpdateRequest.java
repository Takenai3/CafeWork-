package cafework.dto.request;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String fullName;

    // Các trường cập nhật cho Owner
    private String cafeName;
    private String phone;
    private String openHours;
    private String address;
}