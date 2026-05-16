const API_BASE_URL = 'http://localhost:8080/api/cafes';

export const searchCafes = async (keyword) => {
    try {
        const response = await fetch(`${API_BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`);
        
        if (!response.ok) {
            throw new Error('Lỗi khi tải dữ liệu từ máy chủ');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi searchCafes:", error);
        throw error;
    }
};