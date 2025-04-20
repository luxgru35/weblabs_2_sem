//authService.tsx
import axios from 'axios';
import axiosInstance from './axios';
import {User} from "../types/user"

interface RegisterData {
  email: string;
  name: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: 'male' | 'female';
  birthDate: string;
  role?: string;
}
export interface UpdateUserData {
  name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string | null;
  gender?: 'male' | 'female';
  birthDate?: string;
}

export const updateUser = async (userId: number, data: UpdateUserData): Promise<User> => {
  const response = await axiosInstance.put(`/api/users/${userId}`, data);
  return response.data.user;
};
export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post('/api/auth/login', { email, password });
  return response.data;
};

export const register = async (data: RegisterData) => {
  const response = await axiosInstance.post('/api/auth/register', data);
  return response.data;
};


export const getUser = async (): Promise<User> => {
  const response = await axiosInstance.get('/api/auth/me');
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('authToken');
};

export const verifyToken = async (): Promise<{ isValid: boolean; user?: User }> => {
  try {
    const response = await axiosInstance.get('/api/auth/me');
    return { isValid: true, user: response.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return { isValid: false };
    }
    console.error('Auth error:', error);
    return { isValid: false };
  }
};