package cafework.dto;

public class SeatStatusUpdateRequest {

    // Các giá trị hợp lệ: "AVAILABLE", "ALMOST_FULL", "FULL"
    private String seatStatus;

    public SeatStatusUpdateRequest() {
    }

    public String getSeatStatus() {
        return seatStatus;
    }

    public void setSeatStatus(String seatStatus) {
        this.seatStatus = seatStatus;
    }
}