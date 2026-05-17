import axiosClient from "../api/axiosClient";
import axios from "axios";

export const getSearchHistory = async () => {

    const response = await axiosClient.get(
        "/search-history"
    );

    return response.data;
};
export const saveSearchHistory = async (keyword) => {
    const token = localStorage.getItem("token");

    return axios.post(
        "http://localhost:8080/api/search-history/history",
        keyword,
        {
            headers: {
                "Content-Type": "text/plain",
                Authorization: `Bearer ${token}`
            }
        }
    );
};

export const deleteSearchHistory = async (id) => {
    const token = localStorage.getItem("token");

    return axios.delete(
        `http://localhost:8080/api/search-history/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};