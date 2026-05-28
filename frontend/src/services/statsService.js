import api from './api';

const getPlayerStats = async () => {
  const response = await api.get('/stats/players');
  return response.data;
};

const getPositionDistribution = async () => {
  const response = await api.get('/stats/positions');
  return response.data;
};

const getTopTeams = async () => {
  const response = await api.get('/stats/top-teams');
  return response.data;
};

const getNationAnalytics = async () => {
  const response = await api.get('/stats/analytics/nations');
  return response.data;
};

const getCategoryCounts = async (category) => {
  const response = await api.get(`/stats/${category}/count`);
  return response.data;
};

const statsService = {
  getPlayerStats,
  getPositionDistribution,
  getTopTeams,
  getNationAnalytics,
  getCategoryCounts,
};

export default statsService;
