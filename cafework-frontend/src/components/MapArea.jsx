import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


// Sửa lỗi icon marker (giữ nguyên)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;



const MapArea = ({ cafes }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  
  // 1. KHO LƯU TRỮ VỊ TRÍ HIỆN TẠI VÀ ĐƯỜNG ĐI
  const userCoordsRef = useRef(null);
  const routingControlRef = useRef(null);

  // ----------------------------------------------------
  // HÀM VẼ ĐƯỜNG MÀU XANH TỪ VỊ TRÍ HIỆN TẠI ĐẾN QUÁN
  // ----------------------------------------------------
  // Dùng để lưu đường kẻ xanh, dễ dàng xóa đi vẽ lại
  const polylineRef = useRef(null);

  const drawRoute = async (destLat, destLng) => {
    if (!userCoordsRef.current) {
      alert("Bệ hạ vui lòng cho phép định vị trước!");
      return;
    }

    // 1. Xóa đường cũ nếu có
    if (polylineRef.current) {
      mapInstanceRef.current.removeLayer(polylineRef.current);
    }
    // Xóa cái bảng trắng cũ (nếu nó còn sót lại)
    const oldContainer = document.querySelector('.leaflet-routing-container');
    if (oldContainer) oldContainer.remove();

    try {
      // 2. Tự gọi máy chủ OSRM để lấy tọa độ đường đi (profile car)
      const url = `https://router.project-osrm.org/route/v1/car/${userCoordsRef.current[1]},${userCoordsRef.current[0]};${destLng},${destLat}?overview=full&geometries=geojson`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.code !== 'Ok') {
        alert("Máy chủ không tìm thấy đường đi!");
        return;
      }

      // 3. Lấy danh sách tọa độ và vẽ Sợi chỉ xanh
      const coordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
      
      polylineRef.current = L.polyline(coordinates, {
        color: '#0066ff',
        weight: 6,
        opacity: 0.8,
        lineJoin: 'round'
      }).addTo(mapInstanceRef.current);

      // 4. Bay đến để nhìn thấy toàn bộ quãng đường
      mapInstanceRef.current.fitBounds(polylineRef.current.getBounds(), { padding: [50, 50] });

      // 5. Hiển thị bảng thông tin đơn giản (Nền trắng giống ảnh 1)
      const distance = (data.routes[0].distance / 1000).toFixed(1);
      const duration = Math.round(data.routes[0].duration / 60);
      
      showSimpleRoutingPanel(distance, duration);

    } catch (error) {
      console.error("Lỗi vẽ đường:", error);
    }
  };

  // Hàm tạo bảng thông tin (Giống ảnh 1 ngài muốn)
  const showSimpleRoutingPanel = (dist, time) => {
    const existing = document.getElementById('custom-routing-panel');
    if (existing) existing.remove();

    const panel = document.createElement('div');
    panel.id = 'custom-routing-panel';
    panel.innerHTML = `
      <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">ルート案内</div>
      <div style="font-size: 18px; color: #333;">${dist} km、${time} 分</div>
      <div style="margin-top: 10px; font-size: 12px; color: #888;">※ 交通状況により変動します</div>
      <button id="close-route" style="margin-top: 10px; width: 100%; padding: 5px; cursor: pointer;">閉じる</button>
    `;
    Object.assign(panel.style, {
      position: 'absolute', top: '20px', right: '20px', zIndex: 1000,
      backgroundColor: 'white', padding: '15px', borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)', width: '250px'
    });
    document.body.appendChild(panel);
    document.getElementById('close-route').onclick = () => {
        panel.remove();
        if (polylineRef.current) mapInstanceRef.current.removeLayer(polylineRef.current);
    };
  };

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
      markersLayerRef.current = L.layerGroup().addTo(map);

      // Định vị bệ hạ
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (mapInstanceRef.current && mapInstanceRef.current._leaflet_id) {
              const { latitude, longitude } = position.coords;
              userCoordsRef.current = [latitude, longitude]; // LƯU LẠI TỌA ĐỘ ĐỂ LÁT NỮA DÙNG

              mapInstanceRef.current.setView(userCoordsRef.current, 16); 
              L.marker(userCoordsRef.current)
                .addTo(mapInstanceRef.current)
                .bindPopup('<b>Bệ hạ đang ngự tại đây!</b>')
                .openPopup();
              L.circle(userCoordsRef.current, { radius: 100, color: 'blue', fillOpacity: 0.1 })
                .addTo(mapInstanceRef.current);
            }
          },
          (error) => console.error("Lỗi khi lấy vị trí:", error),
          { enableHighAccuracy: true }
        );
      }

      // LẮNG NGHE SỰ KIỆN: Khi ngài nhấp vào nút "Chỉ đường" bên trong Popup
      map.on('popupopen', () => {
        const routeBtn = document.querySelector('.route-btn');
        if (routeBtn) {
          routeBtn.onclick = () => {
            const lat = parseFloat(routeBtn.getAttribute('data-lat'));
            const lng = parseFloat(routeBtn.getAttribute('data-lng'));
            drawRoute(lat, lng);
            map.closePopup(); // Tự động đóng popup sau khi bấm để nhìn đường cho rõ
          };
        }
      });
    }

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
    if (mapInstanceRef.current && markersLayerRef.current && cafes) {
      markersLayerRef.current.clearLayers();

      cafes.forEach((cafe) => {
        if (cafe.latitude && cafe.longitude) {
          const imageUrl = cafe.images && cafe.images.length > 0 
              ? cafe.images[0].imageUrl 
              : 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80';

          const marker = L.marker([cafe.latitude, cafe.longitude])
            .bindPopup(`
              <div className="custom-popup-card" style="width: 250px; font-family: sans-serif; padding: 5px;">
                <img src="${imageUrl}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;" />
                <h3 style="margin: 0 0 5px 0; font-size: 16px; font-weight: bold; color: #333;">${cafe.name}</h3>
                <p style="margin: 0 0 10px 0; font-size: 12px; color: #666; display: flex; align-items: center; gap: 4px;">📍 ${cafe.address}</p>
                
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
                  
                  <button class="route-btn" data-lat="${cafe.latitude}" data-lng="${cafe.longitude}" style="flex: 1; padding: 8px; background-color: #f0f0f0; color: #333; border: 1px solid #ccc; border-radius: 4px; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
                    ルート案内
                  </button>
                </div>
              </div>
            `);
          
          markersLayerRef.current.addLayer(marker);
        }
      });

      if (cafes.length > 0) {
        const group = new L.featureGroup(cafes.map(c => L.marker([c.latitude, c.longitude])));
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    }
  }, [cafes]); 

  return (
    <>
      <style>{`
        /* Tẩy trắng nền, làm tròn góc và đổ bóng giống Ảnh 1 */
        .leaflet-routing-container {
          background-color: #ffffff !important;
          color: #333333 !important;
          font-family: sans-serif !important;
          padding: 15px !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          width: 320px !important;
        }
        
        /* Chỉnh lại các dòng chữ, đường kẻ của bảng */
        .leaflet-routing-alt {
          max-height: 400px !important;
          overflow-y: auto !important;
        }
        .leaflet-routing-alt h2, .leaflet-routing-alt h3 {
          font-size: 16px !important;
          font-weight: bold !important;
          border-bottom: 1px solid #eaeaea !important;
          padding-bottom: 10px !important;
          margin-bottom: 10px !important;
        }
        .leaflet-routing-alt tr { border-bottom: 1px solid #f0f0f0 !important; }
        .leaflet-routing-alt td { padding: 10px 0 !important; font-size: 13px !important; }
        
        /* Chém bỏ mấy cái nút vô dụng mặc định */
        .leaflet-routing-collapse-btn { display: none !important; }
      `}</style>
      
      <div 
        ref={mapContainerRef} 
        style={{ height: '100%', width: '100%', zIndex: 0 }} 
      />
    </>
  );
};

export default MapArea;