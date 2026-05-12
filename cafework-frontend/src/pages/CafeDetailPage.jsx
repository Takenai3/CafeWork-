import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Import CSS
import '../CafeDetailPage.css';

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

  // LOGIC FE: Xác định màu sắc trạng thái chỗ ngồi (khớp với enum từ API)
  const getSeatStatusColor = (status) => {
    if (!status) return 'unknown';
    if (status === 'AVAILABLE') return 'available';    // Xanh lá
    if (status === 'ALMOST_FULL') return 'warning';    // Vàng
    if (status === 'FULL') return 'full';              // Đỏ
    return 'unknown';
  };

  // Nhãn hiển thị thân thiện bằng tiếng Việt
  const getSeatStatusLabel = (status) => {
    if (status === 'AVAILABLE') return '🟢 Còn nhiều chỗ';
    if (status === 'ALMOST_FULL') return '🟡 Sắp đầy chỗ';
    if (status === 'FULL') return '🔴 Hết chỗ ngồi';
    return '⚪ Đang cập nhật';
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
              {getSeatStatusLabel(cafe.seatStatus)}
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
            <iframe
              title="map"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: '8px' }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${cafe.latitude || 21.028511},${cafe.longitude || 105.804817}&z=16&output=embed`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeDetailPage;