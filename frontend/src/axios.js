import axios from "axios";

window.axios = axios;
axios.defaults.withCredentials = false;
axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;

// Attach JWT token to every request automatically
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("spiros_token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

// If token expires on a PROTECTED route (401/403), clear login state
// Do NOT redirect for public routes like /foods
const PUBLIC_PATHS = ["/foods", "/auth/login", "/users/", "/booking"];
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            const url = error.config?.url || "";
            const isPublic = PUBLIC_PATHS.some(p => url.startsWith(p));
            if (!isPublic) {
                localStorage.removeItem("spiros_token");
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);
