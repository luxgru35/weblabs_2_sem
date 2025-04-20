//authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../../types/user';
import { login, register, getUser, logout, verifyToken, updateUser, UpdateUserData} from '../../api/authService';

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
      const token = localStorage.getItem('authToken');
      if (!token) return { isValid: false };
      
      const { isValid, user } = await verifyToken();
      return { isValid, user };
    } catch (error) {
      return rejectWithValue('Ошибка проверки авторизации');
    }
  }
);
  
 
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const user = await login(credentials.email, credentials.password);
      localStorage.setItem('authToken', user.token);  // Сохраняем токен
      return user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка входа');
      }
      return rejectWithValue('Неизвестная ошибка');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logout();
      return null;
    } catch (error) {
      return rejectWithValue('Ошибка при выходе');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; name: string; password: string; role?: string; firstName: string; lastName: string; gender: 'male' | 'female'; birthDate: string }, { rejectWithValue }) => {
    try {
      const response = await register({
        email: userData.email,
        name: userData.name,
        password: userData.password,
        role: userData.role,
        firstName: userData.firstName,
        lastName: userData.lastName,
        gender: userData.gender,
        birthDate: userData.birthDate,
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка регистрации');
      }
      return rejectWithValue('Неизвестная ошибка');
    }
  }
);
export const updateUserProfile = createAsyncThunk(
  'auth/updateUser',
  async ({ userId, userData }: { userId: number; userData: UpdateUserData }, { rejectWithValue }) => {
    try {
      const updatedUser = await updateUser(userId, userData);
      return updatedUser;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка обновления данных');
      }
      return rejectWithValue('Неизвестная ошибка');
    }
  }
);
export const sendResetEmail = createAsyncThunk(
  'auth/sendResetEmail',
  async (email: string, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      return response.data.message;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Ошибка отправки');
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
    resetError: (state) => {
      state.isError = false;
      state.errorMessage = null;
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
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('authToken');
      })
      
      .addCase(logoutUser.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload as string;
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
      .addCase(checkAuthToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthToken.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isValid;
        state.user = action.payload.user || null;
        state.isLoading = false;
      
        if (!action.payload.isValid) {
          localStorage.removeItem('authToken');
        }
      })
      
      .addCase(checkAuthToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      });
  },
});
export const { resetError } = authSlice.actions;
export default authSlice.reducer;