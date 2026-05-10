import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Sửa lỗi icon marker (giữ nguyên như cũ)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapArea = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      // 1. Khởi tạo bản đồ với vị trí mặc định (Hà Nội)
      const map = L.map(mapContainerRef.current).setView([21.0285, 105.8542], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;

      // 2. PHÉP THUẬT DÒ TÌM VỊ TRÍ HIỆN TẠI
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const userLocation = [latitude, longitude];

            // Di chuyển tâm bản đồ về vị trí của bệ hạ
            map.setView(userLocation, 16); 

            // Cắm một chiếc ghim đặc biệt để đánh dấu vị trí của bệ hạ
            L.marker(userLocation)
              .addTo(map)
              .bindPopup('<b>あなたはここにいる</b>')
              .openPopup();
            
            // Vẽ một vòng tròn nhỏ xung quanh để chỉ độ chính xác
            L.circle(userLocation, { radius: 100, color: 'blue', fillOpacity: 0.1 }).addTo(map);
          },
          (error) => {
            console.error("Lỗi khi lấy vị trí:", error);
            alert("あなたの現在地を特定できません。ブラウザの位置情報へのアクセス権限をご確認ください。");
          },
          { enableHighAccuracy: true } // Yêu cầu độ chính xác cao nhất
        );
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ height: '100%', width: '100%', zIndex: 0 }} 
    />
  );
};

export default MapArea;