Hướng dẫn thiết lập môi trường ReactJS (Vite) & Bản đồ Leaflet
Tài liệu này hướng dẫn cách khởi tạo dự án ReactJS kết hợp bản đồ Leaflet một cách ổn định nhất. Lưu ý quan trọng: Chúng ta sẽ sử dụng thư viện leaflet thuần túy kết hợp React Hook, KHÔNG sử dụng react-leaflet để tránh lỗi xung đột phiên bản "Invalid hook call" với React 19.

Bước 1: Yêu cầu hệ thống
Đảm bảo máy tính của bạn đã cài đặt Node.js (Khuyên dùng bản LTS).
Kiểm tra bằng cách mở Terminal và gõ:

Bash
node -v
npm -v
Bước 2: Khởi tạo dự án bằng Vite
Mở Terminal tại thư mục bạn muốn chứa dự án và chạy lệnh:

Bash
npm create vite@latest my-map-project -- --template react
cd my-map-project
Bước 3: Cài đặt thư viện
Chúng ta chỉ cài đặt thư viện bản đồ cốt lõi leaflet:

Bash
npm install leaflet
