import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Sửa lỗi icon marker (giữ nguyên như cũ của ngài)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// component MapArea, nhận danh sách cafes từ HomePage truyền xuống
const MapArea = ({ cafes }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  // Tạo một nhóm riêng biệt để quản lý các lá cờ (dễ dàng xóa đi vẽ lại)
  const markersLayerRef = useRef(null);

  // ----------------------------------------------------
  // PHÉP THUẬT 1: KHỞI TẠO BẢN ĐỒ VÀ ĐỊNH VỊ BỆ HẠ
  // ----------------------------------------------------
  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      // Khởi tạo bản đồ với vị trí mặc định (Hà Nội)
      const map = L.map(mapContainerRef.current).setView([21.0285, 105.8542], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
      
      // Khởi tạo nhóm chứa cờ và ném vào bản đồ
      markersLayerRef.current = L.layerGroup().addTo(map);

      // PHÉP THUẬT DÒ TÌM VỊ TRÍ HIỆN TẠI (ĐÃ GIA CỐ)
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Chỉ làm việc khi mapInstanceRef.current tồn tại VÀ chưa bị phá hủy (_leaflet_id)
            if (mapInstanceRef.current && mapInstanceRef.current._leaflet_id) {
              const { latitude, longitude } = position.coords;
              const userLocation = [latitude, longitude];

              mapInstanceRef.current.setView(userLocation, 16); 

              L.marker(userLocation)
                .addTo(mapInstanceRef.current)
                .bindPopup('<b>Bệ hạ đang ngự tại đây!</b>')
                .openPopup();
              
              L.circle(userLocation, { radius: 100, color: 'blue', fillOpacity: 0.1 })
                .addTo(mapInstanceRef.current);
            }
          },
          (error) => {
            console.error("Lỗi khi lấy vị trí:", error);
          },
          { enableHighAccuracy: true }
        );
      }
    }

    // Khi ngài dời đi (Unmount), phá hủy bản đồ cho sạch bộ nhớ
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // ----------------------------------------------------
  // PHÉP THUẬT 2: ĐỘI QUÂN CẮM CỜ VÀ SỬA POPUP THEO THIẾT KẾ
  // ----------------------------------------------------
  useEffect(() => {
    // Chỉ thực thi khi bản đồ đã sẵn sàng và danh sách quán có tồn tại
    if (mapInstanceRef.current && markersLayerRef.current && cafes) {
      
      // Bước 1: Xóa sạch toàn bộ cờ cũ để không bị lộn xộn
      markersLayerRef.current.clearLayers();

      // Bước 2: Duyệt qua danh sách quán cà phê để cắm cờ
      cafes.forEach((cafe) => {
        if (cafe.latitude && cafe.longitude) {
          // Lấy ảnh thật từ DB (hoặc ảnh dự phòng)
          const imageUrl = cafe.images && cafe.images.length > 0 
              ? cafe.images[0].imageUrl 
              : 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80';

          const marker = L.marker([cafe.latitude, cafe.longitude])
            .bindPopup(`
              <div className="custom-popup-card" style="width: 250px; font-family: sans-serif; padding: 5px;">
                <img src="${imageUrl}" 
                     style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;" />
                
                <h3 style="margin: 0 0 5px 0; font-size: 16px; font-weight: bold; color: #333;">${cafe.name}</h3>
                
                <p style="margin: 0 0 10px 0; font-size: 12px; color: #666; display: flex; align-items: center; gap: 4px;">
                  📍 ${cafe.address}
                </p>
                
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                  <div style="display: flex; align-items: center; font-size: 14px; font-weight: bold; color: #333;">
                    <span style="color: #F59E0B; margin-right: 4px;">★</span>
                    ${cafe.rating || 'N/A'}
                  </div>
                  <div style="display: inline-flex; align-items: center; padding: 4px 10px; background-color: #f5f5f5; border-radius: 20px;">
                    <span style="width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; background-color: ${cafe.seatStatus === '空席あり' ? '#10B981' : (cafe.seatStatus === '満席' ? '#EF4444' : '#F59E0B')};"></span>
                    <span style="font-size: 12px; color: #555;">${cafe.seatStatus || '不明'}</span>
                  </div>
                </div>
                
                <div style="display: flex; gap: 8px;">
                  <button style="flex: 1; padding: 8px; background-color: #5c4033; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">
                    詳細を見る
                  </button>
                  <button style="flex: 1; padding: 8px; background-color: #f0f0f0; color: #333; border: 1px solid #ccc; border-radius: 4px; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
                    ルート案内
                  </button>
                </div>
              </div>
            `);
          
          markersLayerRef.current.addLayer(marker);
        }
      });

      // Bước 3: Tự động điều chỉnh bản đồ để nhìn thấy toàn bộ các Pins
      if (cafes.length > 0) {
        const group = new L.featureGroup(cafes.map(c => L.marker([c.latitude, c.longitude])));
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    }
  }, [cafes]); // Mỗi khi cafes thay đổi, vẽ lại Pins ngay lập tức

  return (
    <div 
      ref={mapContainerRef} 
      style={{ height: '100%', width: '100%', zIndex: 0 }} 
    />
  );
};

export default MapArea;