//userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUser } from '@api/authService';
import { User } from '../../types/user';

interface UserState {
  user: User | null;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  error: null,
};

export const loadUser = createAsyncThunk('user/loadUser', async () => {
  const user = await getUser();
  return user;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state) => {
        state.error = 'Ошибка при загрузке пользователя';
      });
  },
});

export default userSlice.reducer;