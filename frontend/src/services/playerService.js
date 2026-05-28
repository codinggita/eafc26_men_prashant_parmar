import api from './api';

const getPlayers = async (params = {}) => {
  const response = await api.get('/players', { params });
  return response.data;
};

const getPlayer = async (id) => {
  const response = await api.get(`/players/${id}`);
  return response.data;
};

const createPlayer = async (playerData) => {
  const response = await api.post('/players', playerData);
  return response.data;
};

const updatePlayer = async (id, playerData) => {
  const response = await api.put(`/players/${id}`, playerData);
  return response.data;
};

const deletePlayer = async (id) => {
  const response = await api.delete(`/players/${id}`);
  return response.data;
};

const playerService = {
  getPlayers,
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer,
};

export default playerService;
