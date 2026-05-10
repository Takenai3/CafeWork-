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
      // 2. PHÉP THUẬT DÒ TÌM VỊ TRÍ HIỆN TẠI (ĐÃ GIA CỐ)
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // LỚP GIÁP BẢO VỆ MỚI: 
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