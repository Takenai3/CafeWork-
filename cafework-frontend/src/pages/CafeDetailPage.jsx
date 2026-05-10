import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Import thư viện bản đồ React-Leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import CSS (Đã giữ đúng đường dẫn của bạn)
import '../CafeDetailPage.css';

// Khắc phục lỗi không hiển thị icon Marker mặc định của Leaflet trong React/Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const CafeDetailPage = () => {
  // Lấy ID quán từ URL (ví dụ: /cafes/1)
  const { id } = useParams();

  // Quản lý state dữ liệu
  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false); // Trạng thái cho nút làm mới

  // Tách riêng hàm gọi API để tái sử dụng
  const fetchCafeDetails = () => {
    setIsRefreshing(true);
    axios.get(`http://localhost:8080/api/cafes/${id}`)
      .then(response => {
        setCafe(response.data);
        setLoading(false);
        setIsRefreshing(false);
      })
      .catch(err => {
        console.error("Lỗi khi lấy chi tiết quán:", err);
        setError("Không thể tải dữ liệu quán. Vui lòng thử lại sau.");
        setLoading(false);
        setIsRefreshing(false);
      });
  };

  // Tự động gọi API khi vào trang
  useEffect(() => {
    fetchCafeDetails();
  }, [id]);

  // LOGIC FE: Xác định màu sắc trạng thái chỗ ngồi
  const getSeatStatusColor = (statusText) => {
    if (!statusText) return 'unknown';

    const text = statusText.toLowerCase();
    if (text.includes('còn') || text.includes('nhiều') || text.includes('trống')) return 'available'; // Xanh
    if (text.includes('sắp') || text.includes('ít')) return 'warning'; // Vàng
    if (text.includes('hết') || text.includes('đầy') || text.includes('kín')) return 'full'; // Đỏ

    return 'unknown';
  };

  // Hiển thị trạng thái đang tải hoặc lỗi
  if (loading && !cafe) return <div className="loading-container">Đang tải thông tin quán...</div>;
  if (error) return <div className="error-container">{error}</div>;
  if (!cafe) return <div className="error-container">Không tìm thấy thông tin quán cafe này.</div>;

  // Lấy tọa độ để hiển thị bản đồ
  const mapCenter = [cafe.latitude || 21.028511, cafe.longitude || 105.804817];

  return (
    <div className="cafe-detail-container">
      {/* 1. KHỐI HIỂN THỊ ẢNH (GALLERY) */}
      <div className="image-gallery">
        {cafe.images && cafe.images.length > 0 ? (
          cafe.images.map((img, index) => (
            <img
              key={img.id || index}
              src={img.imageUrl}
              alt={`${cafe.name} - góc nhìn ${index + 1}`}
              className="gallery-item"
            />
          ))
        ) : (
          <div className="no-image-box">
            <p>Quán chưa cập nhật hình ảnh</p>
          </div>
        )}
      </div>

      <div className="content-layout">
        {/* 2. CỘT TRÁI: THÔNG TIN CHI TIẾT QUÁN */}
        <div className="info-section">
          <div className="header-info">
            <h1>{cafe.name}</h1>
            <span className="rating-badge">⭐ {cafe.rating ? cafe.rating : 'Chưa có đánh giá'}</span>
          </div>

          {/* KHU VỰC HIỂN THỊ TRẠNG THÁI CHỖ NGỒI MỚI */}
          <div className="seat-status-container">
            <div className={`seat-status-tag ${getSeatStatusColor(cafe.seatStatus)}`}>
              Tình trạng bàn: {cafe.seatStatus || 'Đang cập nhật'}
            </div>

            <button
              className="btn-refresh-status"
              onClick={fetchCafeDetails}
              disabled={isRefreshing}
            >
              {isRefreshing ? '🔄 Đang tải...' : '🔄 Cập nhật'}
            </button>
          </div>

          <div className="detail-list">
            <div className="detail-item">
              <strong>📍 Địa chỉ:</strong> {cafe.address || 'Đang cập nhật'}
            </div>
            <div className="detail-item">
              <strong>🕒 Giờ hoạt động:</strong> {cafe.openHours || 'Đang cập nhật'}
            </div>
          </div>

          <div className="description-box">
            <h3>📖 Giới thiệu về quán</h3>
            <p>{cafe.description || 'Chưa có thông tin giới thiệu.'}</p>
          </div>
        </div>

        {/* 3. CỘT PHẢI: BẢN ĐỒ VỊ TRÍ (LEAFLET) */}
        <div className="map-sidebar">
          <h3>🗺️ Vị trí trên bản đồ</h3>
          <div className="map-wrapper" style={{ height: '400px', width: '100%' }}>
            <MapContainer
              center={mapCenter}
              zoom={15}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%', borderRadius: '8px', zIndex: 1 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={mapCenter}>
                <Popup>
                  <strong>{cafe.name}</strong> <br />
                  {cafe.address}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeDetailPage;