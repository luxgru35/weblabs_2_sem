//authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../../types/user';
import { login, register, getUser, logout, verifyToken } from '../../api/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isError: false,
  errorMessage: null,
};

export const checkAuthToken = createAsyncThunk(
    'auth/verifyToken',
    async (_, { rejectWithValue }) => {
      try {
        const isValid = await verifyToken();
        return isValid;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return rejectWithValue(error.response?.data?.message || 'Ошибка проверки токена');
        }
        return rejectWithValue('Неизвестная ошибка');
      }
    }
  );
  
 
// Создаем асинхронный thunk для входа пользователя
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await login(credentials.email, credentials.password);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка входа');
      }
      return rejectWithValue('Неизвестная ошибка');
    }
  }
);

// Создаем асинхронный thunk для регистрации
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; name: string; password: string; role?: string }, { rejectWithValue }) => {
    try {
      const response = await register(userData.email, userData.name, userData.password, userData.role);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка регистрации');
      }
      return rejectWithValue('Неизвестная ошибка');
    }
  }
);

// Создаем асинхронный thunk для получения данных пользователя
export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await getUser();
      return user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки пользователя');
      }
      return rejectWithValue('Неизвестная ошибка');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Синхронный редьюсер для выхода
    logoutUser: (state) => {
      logout();
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Обработка входа
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })

      // Обработка регистрации
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })

      // Обработка загрузки пользователя
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
      .addCase(checkAuthToken.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload;
        if (!action.payload) {
          state.user = null;
        }
      })
      .addCase(checkAuthToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;