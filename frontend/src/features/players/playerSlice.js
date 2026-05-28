import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import playerService from '../../services/playerService';

export const fetchPlayers = createAsyncThunk(
  'players/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await playerService.getPlayers(params);
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to fetch players');
    }
  }
);

export const addPlayer = createAsyncThunk(
  'players/add',
  async (playerData, { rejectWithValue }) => {
    try {
      return await playerService.createPlayer(playerData);
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to add player');
    }
  }
);

export const updatePlayer = createAsyncThunk(
  'players/update',
  async ({ id, playerData }, { rejectWithValue }) => {
    try {
      return await playerService.updatePlayer(id, playerData);
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to update player');
    }
  }
);

export const deletePlayer = createAsyncThunk(
  'players/delete',
  async (id, { rejectWithValue }) => {
    try {
      await playerService.deletePlayer(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to delete player');
    }
  }
);

const initialState = {
  players: [],
  currentPlayer: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },
};

const playerSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setCurrentPlayer: (state, action) => {
      state.currentPlayer = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Players
      .addCase(fetchPlayers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.loading = false;
        state.players = action.payload.data;
        state.pagination = {
          ...state.pagination,
          total: action.payload.total,
        };
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Player
      .addCase(addPlayer.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPlayer.fulfilled, (state, action) => {
        state.loading = false;
        state.players.unshift(action.payload.data);
      })
      .addCase(addPlayer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Player
      .addCase(updatePlayer.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePlayer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.players.findIndex(p => p._id === action.payload.data._id);
        if (index !== -1) {
          state.players[index] = action.payload.data;
        }
      })
      .addCase(updatePlayer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Player
      .addCase(deletePlayer.fulfilled, (state, action) => {
        state.players = state.players.filter(p => p._id !== action.payload);
      });
  },
});

export const { setCurrentPlayer, clearError } = playerSlice.actions;
export default playerSlice.reducer;
