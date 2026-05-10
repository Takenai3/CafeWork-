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

// 1. MỞ CỔNG THÀNH: Nhận danh sách cafes từ HomePage truyền xuống
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
      const map = L.map(mapContainerRef.current).setView([21.0285, 105.8542], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
      
      // Khởi tạo nhóm chứa cờ và ném vào bản đồ
      markersLayerRef.current = L.layerGroup().addTo(map);

      // PHÉP THUẬT DÒ TÌM VỊ TRÍ HIỆN TẠI (ĐÃ GIA CỐ CỦA NGÀI)
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (mapInstanceRef.current && mapInstanceRef.current._leaflet_id) {
              const { latitude, longitude } = position.coords;
              const userLocation = [latitude, longitude];

              mapInstanceRef.current.setView(userLocation, 16); 

              L.marker(userLocation)
                .addTo(mapInstanceRef.current)
                .bindPopup('<b>あなたはここにいる!</b>')
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
  // PHÉP THUẬT 2: ĐỘI QUÂN CẮM CỜ KHI CÓ KẾT QUẢ TÌM KIẾM
  // ----------------------------------------------------
  useEffect(() => {
    // Chỉ thực thi khi bản đồ đã sẵn sàng và danh sách quán có tồn tại
    if (mapInstanceRef.current && markersLayerRef.current && cafes) {
      
      // Bước 1: Xóa sạch toàn bộ cờ cũ để không bị lộn xộn
      markersLayerRef.current.clearLayers();

      // Bước 2: Lọc ra những quán có tọa độ hợp lệ
      const validCafes = cafes.filter(c => c.latitude && c.longitude);

      // Bước 3: Duyệt qua từng quán và cắm cờ
      validCafes.forEach((cafe) => {
        // Lấy ảnh thật từ DB (hoặc ảnh dự phòng)
        const imageUrl = cafe.images && cafe.images.length > 0 
            ? cafe.images[0].imageUrl 
            : 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=150&q=80';

        const marker = L.marker([cafe.latitude, cafe.longitude])
          .bindPopup(`
            <div style="width: 150px; text-align: center;">
              <img src="${imageUrl}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
              <h4 style="margin: 0; font-size: 14px; color: #333;">${cafe.name}</h4>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #666;">📍 ${cafe.address}</p>
            </div>
          `);
        
        markersLayerRef.current.addLayer(marker);
      });

      // Bước 4: Ra lệnh cho bản đồ tự động bay (zoom) sao cho nhìn bao quát được toàn bộ cờ
      if (validCafes.length > 0) {
        const group = new L.featureGroup(validCafes.map(c => L.marker([c.latitude, c.longitude])));
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1)); // pad(0.1) tạo thêm một chút viền cho đẹp
      }
    }
  }, [cafes]); // <--- Lệnh này tự động chạy lại mỗi khi ngài tìm kiếm quán mới

  return (
    <div 
      ref={mapContainerRef} 
      style={{ height: '100%', width: '100%', zIndex: 0 }} 
    />
  );
};

export default MapArea;