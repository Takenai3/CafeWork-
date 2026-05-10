// src/pages/HomePage.jsx
import React, { useState } from 'react'; // Đã thêm useState
import MapArea from '../components/MapArea';
import SearchBar from '../components/Search/SearchBar'; 

const HomePage = () => {
  // 1. KHO TRUNG TÂM: Nơi lưu trữ danh sách quán cà phê tìm được
  const [cafes, setCafes] = useState([]);

  return (
    // THÂN MÌNH: Khung ngoài cùng chiếm 100% màn hình, xếp dọc
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* TẦNG 1: TOP HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', borderBottom: '1px solid #eaeaea', backgroundColor: '#fff' }}>
        <div style={{ color: '#555', cursor: 'pointer' }}>🌐 JP 日本語</div>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5a2b' }}>☕ カフェワーク</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ padding: '8px 16px', border: '1px solid #ccc', backgroundColor: '#f8f9fa', borderRadius: '4px', cursor: 'pointer' }}>ログイン</button>
          <button style={{ padding: '8px 16px', border: 'none', backgroundColor: '#5c4033', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>登録</button>
        </div>
      </div>

      {/* TẦNG 2: NAVIGATION TABS */}
      <div style={{ padding: '0 20px', borderBottom: '1px solid #eaeaea', backgroundColor: '#fff' }}>
        <div style={{ display: 'inline-block', padding: '10px 15px', borderBottom: '3px solid #8b5a2b', fontWeight: 'bold', color: '#333' }}>
          ホーム
        </div>
      </div>

      {/* TẦNG 3: PHẦN THÂN CHÍNH (Chia 2 cột) */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* CỘT TRÁI: SIDEBAR */}
        <div style={{ width: '400px', backgroundColor: '#fafafa', borderRight: '1px solid #ccc', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
          {/* Ô tìm kiếm: Truyền hàm setCafes xuống cho SearchBar */}
          <SearchBar onSearchData={setCafes} />
        </div>

        {/* CỘT PHẢI: BẢN ĐỒ */}
        <div style={{ flex: 1, position: 'relative' }}>
          
          {/* Lớp dưới cùng: Bản đồ - Truyền danh sách quán xuống để cắm cờ */}
          <MapArea cafes={cafes} />

          {/* ĐÃ CHÉM BỎ: Bảng chỉ đường trôi nổi (Số 10) đã bị xóa sổ khỏi đây! */}

        </div>
      </div>
    </div>
  );
};

export default HomePage;