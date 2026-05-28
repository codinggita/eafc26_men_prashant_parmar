import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  players: [],
  currentPlayer: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const playerSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    fetchPlayersStart: (state) => {
      state.loading = true;
    },
    fetchPlayersSuccess: (state, action) => {
      state.loading = false;
      state.players = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    fetchPlayersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentPlayer: (state, action) => {
      state.currentPlayer = action.payload;
    },
  },
});

export const { fetchPlayersStart, fetchPlayersSuccess, fetchPlayersFailure, setCurrentPlayer } = playerSlice.actions;
export default playerSlice.reducer;
