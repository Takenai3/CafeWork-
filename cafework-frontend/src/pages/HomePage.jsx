// src/pages/HomePage.jsx
import React from 'react';
import MapArea from '../components/MapArea';
import SearchBar from '../components/Search/SearchBar'; // Import component SearchBar

const HomePage = () => {
  return (
    // THÂN MÌNH: Khung ngoài cùng chiếm 100% màn hình, xếp dọc
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* TẦNG 1: TOP HEADER (Số 1, 2, 3, 4) */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '10px 20px', borderBottom: '1px solid #eaeaea', backgroundColor: '#fff' 
      }}>
        {/* Số 1: Ngôn ngữ */}
        <div style={{ color: '#555', cursor: 'pointer' }}>
          🌐 JP 日本語
        </div>

        {/* Số 2: Logo */}
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5a2b' }}>
          ☕ カフェワーク
        </div>

        {/* Số 3, 4: Nút Đăng nhập / Đăng ký */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ padding: '8px 16px', border: '1px solid #ccc', backgroundColor: '#f8f9fa', borderRadius: '4px', cursor: 'pointer' }}>
            ログイン
          </button>
          <button style={{ padding: '8px 16px', border: 'none', backgroundColor: '#5c4033', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>
            登録
          </button>
        </div>
      </div>

      {/* TẦNG 2: NAVIGATION TABS (Số 5) */}
      <div style={{ padding: '0 20px', borderBottom: '1px solid #eaeaea', backgroundColor: '#fff' }}>
        <div style={{ 
          display: 'inline-block', padding: '10px 15px', 
          borderBottom: '3px solid #8b5a2b', fontWeight: 'bold', color: '#333' 
        }}>
          ホーム
        </div>
      </div>

      {/* TẦNG 3: PHẦN THÂN CHÍNH (Chia 2 cột) */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* CỘT TRÁI: SIDEBAR (Số 6, 7, 8) */}
        <div style={{ 
          width: '380px', backgroundColor: '#fafafa', borderRight: '1px solid #ccc',
          display: 'flex', flexDirection: 'column', overflowY: 'auto', zIndex: 10
        }}>
          
          {/* Ô tìm kiếm: ĐÃ THAY THẾ BẰNG COMPONENT SEARCHBAR */}
          <div style={{ padding: '15px', borderBottom: '1px solid #eaeaea' }}>
             <SearchBar />
          </div>

          {/* Panel Tuyến đường */}
          <div style={{ margin: '15px', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>🧭 ルート案内 (6)</h4>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>目的地: カフェ・ジアン</div>
            
            {/* Input điểm xuất phát (Số 7) */}
            <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
              <input 
                type="text" defaultValue="ハノイ工科大学" 
                style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <button style={{ padding: '8px 15px', backgroundColor: '#5c4033', color: '#fff', border: 'none', borderRadius: '4px' }}>
                検索
              </button>
            </div>

            {/* Tóm tắt khoảng cách (Số 8) */}
            <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>4.3 km</div>
                <div style={{ fontSize: '12px', color: '#777' }}>距離</div>
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>8 分</div>
                <div style={{ fontSize: '12px', color: '#777' }}>所要時間</div>
              </div>
            </div>
          </div>

        </div>

        {/* CỘT PHẢI: BẢN ĐỒ VÀ BẢNG TRÔI NỔI (Số 9, 10) */}
        <div style={{ flex: 1, position: 'relative' }}>
          
          {/* Lớp dưới cùng: Bản đồ */}
          <MapArea />

          {/* Lớp bề mặt: Bảng chỉ đường trôi nổi (Số 10) */}
          <div style={{ 
            position: 'absolute', top: '20px', right: '20px', zIndex: 1000,
            width: '300px', backgroundColor: '#fff', borderRadius: '8px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', padding: '15px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Đường Đại Cồ Việt, Phố Huế</h3>
            <div style={{ fontSize: '12px', color: '#555', marginBottom: '15px' }}>4.3 km, 8分</div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#333' }}>
              <li style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
                <span>北へ進む</span> <span style={{ color: '#888' }}>100 m</span>
              </li>
              <li style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
                <span>左折する</span> <span style={{ color: '#888' }}>250 m</span>
              </li>
              <li style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
                <span>右折する</span> <span style={{ color: '#888' }}>40 m</span>
              </li>
              <li style={{ padding: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
                <span>...</span> <span>...</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomePage;