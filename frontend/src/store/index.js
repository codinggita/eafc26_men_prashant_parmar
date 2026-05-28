import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice';
import playerReducer from '../features/players/playerSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    players: playerReducer,
    ui: uiReducer,
  },
});

export default store;
