import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({ baseURL: BASE_URL, timeout: 10000 });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        await AsyncStorage.setItem('accessToken', data.accessToken);
        await AsyncStorage.setItem('refreshToken', data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
