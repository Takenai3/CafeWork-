import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix lỗi mất icon marker mặc định của Leaflet khi dùng với Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41], // Căn chỉnh mũi nhọn của ghim
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapArea = () => {
  // Dùng useRef để giữ thẻ div chứa bản đồ và đối tượng map
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Chỉ khởi tạo bản đồ 1 lần duy nhất khi component render
    if (mapContainerRef.current && !mapInstanceRef.current) {
      
      // 1. Tạo bản đồ, hướng về Đại học Bách Khoa
      const map = L.map(mapContainerRef.current).setView([21.0071, 105.8431], 15);

      // 2. Phủ lớp bản đồ đường phố lên
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // 3. Cắm một cái ghim và mở Popup
      L.marker([21.0071, 105.8431]).addTo(map)
        .bindPopup('<b>Đại học Bách Khoa Hà Nội</b><br>Điểm xuất phát lý tưởng!')
        .openPopup();

      // Lưu lại instance để quản lý
      mapInstanceRef.current = map;
    }

    // Dọn dẹp bộ nhớ khi chuyển trang (Best Practice)
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    // Thẻ div này BẮT BUỘC phải có height 100% để bản đồ bung ra
    <div 
      ref={mapContainerRef} 
      style={{ height: '100%', width: '100%', zIndex: 0 }} 
    />
  );
};

export default MapArea;