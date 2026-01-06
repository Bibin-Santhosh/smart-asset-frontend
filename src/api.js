import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============================
   REQUEST INTERCEPTOR
   Attach JWT ONLY to API calls
   ============================ */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // 🔒 Attach token ONLY for protected endpoints
    if (
      token &&
      !config.url.includes("login") &&
      !config.url.includes("register")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================
   RESPONSE INTERCEPTOR
   Handle token expiry AFTER login
   ============================ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config.url.includes("login")
    ) {
      console.warn("Unauthorized – token expired");

      localStorage.removeItem("token");

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;
