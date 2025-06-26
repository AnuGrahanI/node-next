import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

const API_BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000"; 

// ✅ Create Axios Instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // optional: for cookie/session auth
});

api.interceptors.request.use((config) => {
  // Get token from localStorage (or cookies if using SSR)
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ✅ Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    
    return Promise.reject(error.response?.data || error.message);
  }
);

// ✅ API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ✅ Generic API Client
const apiClient = {
  get: async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response: AxiosResponse<ApiResponse<T>> = await api.get(url, config);
    return response.data;
  },

  post: async <T, U>(
    url: string,
    data: U,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response: AxiosResponse<ApiResponse<T>> = await api.post(url, data, config);
    return response.data;
  },

  put: async <T, U>(
    url: string,
    data: U,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response: AxiosResponse<ApiResponse<T>> = await api.put(url, data, config);
    return response.data;
  },

  delete: async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response: AxiosResponse<ApiResponse<T>> = await api.delete(url, config);
    return response.data;
  },
};

export default apiClient;
