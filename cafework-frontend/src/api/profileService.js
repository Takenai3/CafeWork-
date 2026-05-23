import axiosClient from '../api/axiosClient';

export const profileService = {
    // Lấy thông tin hồ sơ của người dùng đang đăng nhập
    getMyProfile: async () => {
        // axiosClient baseURL mặc định đã có "/api" (xem axiosClient.js)
        // nên ở đây chỉ cần gọi "/v1/profile" để khớp backend: /api/v1/profile
        const response = await axiosClient.get('/v1/profile');
        return response.data;
    },

    // Cập nhật thông tin hồ sơ
    updateMyProfile: async (profileData) => {
        const response = await axiosClient.put('/v1/profile', profileData);
        return response.data;
    }
};