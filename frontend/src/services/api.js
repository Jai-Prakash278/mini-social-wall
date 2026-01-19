import axios from "axios";

const api = axios.create({
    baseURL: "https://mini-social-wall-1snj.onrender.com",
});

export default api;