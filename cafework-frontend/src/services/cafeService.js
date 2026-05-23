import api from '../api/axiosClient';

export const searchCafes = async (keyword) => {
    try {
        const response = await api.get(`/cafes/search?keyword=${encodeURIComponent(keyword)}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi searchCafes:", error);
        const errorMsg = error.response?.data || 'Lỗi khi tải dữ liệu từ máy chủ';
        throw new Error(typeof errorMsg === 'string' ? errorMsg : 'Lỗi khi tải dữ liệu từ máy chủ');
    }
};

export const getAllCafes = async () => {
    try {
        const response = await api.get('/cafes');
        return response.data;
    } catch (error) {
        console.error("Lỗi getAllCafes:", error);
        throw error;
    }
};

export const getCafeById = async (id) => {
    try {
        const response = await api.get(`/cafes/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi getCafeById:", error);
        throw error;
    }
};
