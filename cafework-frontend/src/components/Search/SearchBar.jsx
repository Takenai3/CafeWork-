import React, { useState, useEffect, useRef } from 'react';
import { searchCafes } from '../../services/cafeService';
import './SearchBar.css';

const SearchBar = () => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // State cho Autocomplete
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    
    const searchBoxRef = useRef(null);

    // Khởi động lấy danh sách ngẫu nhiên hoặc trống
    useEffect(() => {
        // Tạm thời gọi bằng rỗng để lấy toàn bộ hoặc không làm gì
        // handleSearchEvent(''); 
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchEvent = async (searchKeyword) => {
        setShowDropdown(false);
        setLoading(true);
        setError(null);
        try {
            // GỌI API THẬT TỪ SPRING BOOT!
            // (Nếu từ khóa rỗng, API sẽ trả về toàn bộ quán, hoặc ngài có thể chặn lại tùy ý)
            const data = await searchCafes(searchKeyword);
            setResults(data);
        } catch (err) {
            console.error("Lỗi:", err);
            setError('エラーが発生しました。');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };
    const onSubmit = (e) => {
        e.preventDefault();
        handleSearchEvent(keyword);
    };

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setKeyword(value);

        if (value.trim().length > 0) {
            setShowDropdown(true);
            try {
                // Tạm thời ẩn API call, dùng tĩnh để test UI
                setSuggestions([{id: 1, name: value + ' Coffee', address: 'Gợi ý...'}]);
            } catch (error) {
                console.error("Lỗi lấy gợi ý:", error);
            }
        } else {
            setShowDropdown(false);
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (cafeName) => {
        setKeyword(cafeName);
        setShowDropdown(false);
        handleSearchEvent(cafeName);
    };

    return (
        <div className="sidebar-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            {/* KHỐI 1: TÌM KIẾM VÀ TÙY CHỌN */}
            <div style={{ padding: '10px 15px', backgroundColor: 'white', zIndex: 10 }}>
                <form onSubmit={onSubmit} className="search-box-modern" ref={searchBoxRef}>
                    <div className="input-wrapper" style={{ position: 'relative', width: '100%' }}>
                        <span className="search-icon">🔍</span>
                        <input 
                            type="text" 
                            placeholder="エリアや条件で検索..." 
                            value={keyword}
                            onChange={handleInputChange}
                            onFocus={() => { if(keyword.trim().length > 0) setShowDropdown(true) }}
                            className="search-input-modern"
                            style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #ddd' }}
                        />
                        
                        {/* Autocomplete Dropdown */}
                        {showDropdown && keyword.trim().length > 0 && (
                            <ul className="autocomplete-dropdown" style={autocompleteStyle}>
                                {suggestions.map((cafe) => (
                                    <li key={cafe.id} style={acItemStyle} onClick={() => handleSuggestionClick(cafe.name)}>
                                        📍 {cafe.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    
                    {/* Nút Lọc (Filter) */}
                    <button type="button" style={filterBtnStyle}>
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                             <line x1="4" y1="21" x2="4" y2="14"></line>
                             <line x1="4" y1="10" x2="4" y2="3"></line>
                             <line x1="12" y1="21" x2="12" y2="12"></line>
                             <line x1="12" y1="8" x2="12" y2="3"></line>
                             <line x1="20" y1="21" x2="20" y2="16"></line>
                             <line x1="20" y1="12" x2="20" y2="3"></line>
                             <line x1="1" y1="14" x2="7" y2="14"></line>
                             <line x1="9" y1="8" x2="15" y2="8"></line>
                             <line x1="17" y1="16" x2="23" y2="16"></line>
                        </svg>
                    </button>
                </form>

                {/* Các bộ lọc nhanh (Chips) */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto' }}>
                    <button style={chipActiveStyle}>すべて</button>
                    <button style={chipStyle}>Wi-Fiあり</button>
                    <button style={chipStyle}>電源あり</button>
                </div>
            </div>

            {/* KHỐI 2: DANH SÁCH QUÁN CAFE THEO THIẾT KẾ (Cuộn dọc) */}
            <div className="results-scroll-area" style={scrollAreaStyle}>
                {loading && <p style={{textAlign: 'center', color: '#666'}}>読み込み中...</p>}
                
                {results.map((cafe) => (
                    <div key={cafe.id} className="cafe-card" style={cardStyle}>
                        {/* Khối Ảnh (Mục 9) và Nút thả tim (Mục 10) */}
                        <div style={{ position: 'relative' }}>
                            <img 
                                src={cafe.images && cafe.images.length > 0 ? cafe.images[0].imageUrl : 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80'} 
                                alt={cafe.name} 
                                style={imageStyle} 
                                onError={(e) => {
                                    e.target.onerror = null; // Ngăn chặn vòng lặp vô tận
                                    e.target.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80'; // Thay bằng ảnh mặc định siêu đẹp
                                }}
                            />
                            <button style={heartBtnStyle}>
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="#666" strokeWidth="2" fill="none">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </button>
                        </div>

                        {/* Khối Thông tin */}
                        <div style={cardContentStyle}>
                            {/* Tên Quán (Mục 11) và Rating (Mục 13) */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <h3 style={titleStyle}>{cafe.name}</h3>
                                <div style={ratingStyle}>
                                    <span style={{ color: '#F59E0B', marginRight: '4px' }}>★</span>
                                    {cafe.rating}
                                </div>
                            </div>

                            {/* Trạng thái (Mục 12) */}
                            <div style={statusWrapperStyle}>
                                <span style={getStatusDotStyle(cafe.seatStatus)}></span>
                                <span style={{ fontSize: '13px', color: '#555' }}>{cafe.seatStatus}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ==========================================
// CÁC STYLE CSS MÔ PHỎNG ĐÚNG THEO BỨC HỌA
// ==========================================

const autocompleteStyle = {
    position: 'absolute', top: '100%', left: 0, right: 0,
    backgroundColor: 'white', border: '1px solid #ddd',
    borderRadius: '4px', zIndex: 100, listStyle: 'none', padding: 0, margin: 0,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const acItemStyle = { padding: '10px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' };

const filterBtnStyle = {
    marginLeft: '8px', padding: '10px', backgroundColor: '#f8f9fa',
    border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
};

const chipStyle = {
    padding: '6px 12px', borderRadius: '20px', border: '1px solid #ddd',
    backgroundColor: 'white', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap'
};

const chipActiveStyle = { ...chipStyle, backgroundColor: '#e6f2ff', borderColor: '#0066cc', color: '#0066cc' };

// Khu vực cuộn dành riêng cho danh sách
const scrollAreaStyle = {
    flex: 1, overflowY: 'auto', padding: '15px',
    backgroundColor: '#f5f5f5' // Màu nền xám nhạt làm nổi bật thẻ trắng
};

// Thẻ Card Quán Cafe
const cardStyle = {
    backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden',
    marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex', flexDirection: 'column'
};

const imageStyle = { width: '100%', height: '180px', objectFit: 'cover' };

const heartBtnStyle = {
    position: 'absolute', top: '12px', right: '12px',
    backgroundColor: 'white', border: 'none', borderRadius: '50%',
    width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const cardContentStyle = { padding: '15px' };

const titleStyle = { margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#333' };

const ratingStyle = { fontSize: '14px', fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center' };

const statusWrapperStyle = {
    display: 'inline-flex', alignItems: 'center',
    padding: '4px 10px', backgroundColor: '#f5f5f5', borderRadius: '20px'
};

// Hàm đổi màu chấm tròn tùy theo trạng thái chỗ ngồi
const getStatusDotStyle = (status) => ({
    width: '8px', height: '8px', borderRadius: '50%', marginRight: '6px',
    backgroundColor: status === '空席あり' ? '#10B981' : (status === '満席' ? '#EF4444' : '#F59E0B') // Xanh - Đỏ - Vàng
});

export default SearchBar;