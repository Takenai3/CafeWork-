package cafework.util;

import org.springframework.stereotype.Component;

@Component
public class EmailUtil {

    public void sendOtpEmail(String email, String code) {
        System.out.println("====== MOCK EMAIL ======");
        System.out.println("Gửi mã OTP [" + code + "] tới địa chỉ: " + email);
        System.out.println("========================");
    }
}
