import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const directToken = localStorage.getItem("token");
  if (directToken) return directToken;

  const storedAuth = localStorage.getItem("auth");
  if (storedAuth) {
    try {
      return JSON.parse(storedAuth)?.token || null;
    } catch {
      return null;
    }
  }

  return null;
};

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized - logging out");

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("auth");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;