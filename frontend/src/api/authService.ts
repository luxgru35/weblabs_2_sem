import axiosInstance from './axios';

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post('/api/auth/login', { email, password });
  return response.data;
};

export const register = async (email: string, name: string, password: string, role?: string) => {
  const response = await axiosInstance.post('/api/auth/register', { email, name, password, role });
  return response.data;
};