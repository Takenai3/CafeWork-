import React, { useState, useEffect, useRef } from 'react';
import { searchCafes } from '../../services/cafeService';
import './SearchBar.css';

const SearchBar = () => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- State mới cho Autocomplete ---
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    
    // useRef để xử lý sự kiện click ra ngoài dropdown thì đóng nó lại
    const searchBoxRef = useRef(null);

    // Tải toàn bộ quán lúc khởi động
    useEffect(() => {
        handleSearchEvent('');
    }, []);

    // Xử lý sự kiện click ra ngoài để đóng dropdown autocomplete
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Gọi API chính thức khi bấm "Enter"
    const handleSearchEvent = async (searchKeyword) => {
        setShowDropdown(false); // Đóng gợi ý khi tìm kiếm thực sự
        setLoading(true);
        setError(null);
        try {
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

    // Hàm xử lý mỗi khi gõ phím
    const handleInputChange = async (e) => {
        const value = e.target.value;
        setKeyword(value);

        if (value.trim().length > 0) {
            // Hiển thị dropdown
            setShowDropdown(true);
            try {
                // Gọi API lấy gợi ý (có thể tối ưu bằng kỹ thuật Debounce nếu cần)
                const data = await searchCafes(value);
                setSuggestions(data.slice(0, 5)); // Chỉ lấy tối đa 5 gợi ý
            } catch (error) {
                console.error("Lỗi lấy gợi ý:", error);
            }
        } else {
            setShowDropdown(false);
            setSuggestions([]);
        }
    };

    // Khi click vào một gợi ý
    const handleSuggestionClick = (cafeName) => {
        setKeyword(cafeName);
        setShowDropdown(false);
        handleSearchEvent(cafeName); // Thực hiện tìm kiếm ngay quán đó
    };

    return (
        <div className="sidebar-content">
            {/* Thêm ref vào form để bắt sự kiện click ra ngoài */}
            <form onSubmit={onSubmit} className="search-box-modern" ref={searchBoxRef}>
                <div className="input-wrapper" style={{ position: 'relative' }}>
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder="エリアや条件で検索..." 
                        value={keyword}
                        onChange={handleInputChange} // Đổi thành handleInputChange
                        onFocus={() => { if(keyword.trim().length > 0) setShowDropdown(true) }}
                        className="search-input-modern"
                    />
                    
                    {/* DROPDOWN AUTOCOMPLETE */}
                    {showDropdown && keyword.trim().length > 0 && (
                        <ul className="autocomplete-dropdown">
                            {suggestions.length > 0 ? (
                                suggestions.map((cafe) => (
                                    <li 
                                        key={cafe.id} 
                                        className="autocomplete-item"
                                        onClick={() => handleSuggestionClick(cafe.name)}
                                    >
                                        <span className="ac-icon">📍</span>
                                        <span className="ac-name">{cafe.name}</span>
                                        <span className="ac-address">{cafe.address}</span>
                                    </li>
                                ))
                            ) : (
                                // THÊM KHỐI NÀY: Hiển thị khi không có gợi ý nào khớp
                                <li className="autocomplete-no-result">
                                    検索結果がありません
                                </li>
                            )}
                        </ul>
                    )}
                </div>
                
                <button type="button" className="filter-btn-square">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                        {/* SVG nội dung giữ nguyên... */}
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

            {/* Các phần còn lại giữ nguyên... */}
            <div className="filter-chips-container">
                <button className="chip active">すべて</button>
            </div>
            {error && <div style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>{error}</div>}
            
            {/* Khối hiển thị kết quả giữ nguyên như bản trước... */}
            <div className="results-scroll-area">
                {/* ... */}
            </div>
        </div>
    );
};

export default SearchBar;