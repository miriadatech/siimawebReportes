import axios from "axios";
import { API_BASE_URL } from "../../config";


export const api = axios.create({ baseURL: API_BASE_URL });


api.interceptors.request.use((config) => {
const token = localStorage.getItem("auth_token");
if (token) {
config.headers = config.headers || {};
config.headers["Authorization"] = `Bearer ${token}`;
}
return config;
});


export default api;