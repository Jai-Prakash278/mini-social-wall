import axios from "axios";

const api = axios.create({
    baseURL: "https://mini-social-wall-j97o.onrender.com",
});

export default api;