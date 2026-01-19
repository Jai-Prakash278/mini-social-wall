import axios from "axios";

const api = axios.create({
    baseURL: "https://mini-social-wall-j97o.onrender.com",
});

export const API_BASE_URL = "https://mini-social-wall-j97o.onrender.com";

export default api;
