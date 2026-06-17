import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import statsService from '../services/statsService';
import toast from 'react-hot-toast';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [playerStats, setPlayerStats] = useState(null);
  const [positionData, setPositionData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [nationData, setNationData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [statsRes, posRes, teamRes, nationRes] = await Promise.all([
          statsService.getPlayerStats(),
          statsService.getPositionDistribution(),
          statsService.getTopTeams(),
          statsService.getNationAnalytics(),
        ]);

        setPlayerStats(statsRes.data);
        setPositionData(posRes.data.map(item => ({ name: item._id, value: item.count })));
        setTeamData(teamRes.data.map(item => ({ name: item._id, rating: Math.round(item.avgRating * 10) / 10, players: item.playerCount })));
        setNationData(nationRes.data.slice(0, 10).map(item => ({ name: item._id, count: item.count })));
      } catch (error) {
        console.error('Analytics Error:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="animate-fade-in">
      <Helmet>
        <title>Analytics | EA Sports FC 26</title>
      </Helmet>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Analytics Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Players</Typography>
              <Typography variant="h4">{playerStats?.totalPlayers?.toLocaleString() || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Average Rating</Typography>
              <Typography variant="h4">{Math.round((playerStats?.averageRating || 0) * 10) / 10}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Highest Rating</Typography>
              <Typography variant="h4">{playerStats?.highestRating || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Avg Pace</Typography>
              <Typography variant="h4">{Math.round((playerStats?.averagePace || 0) * 10) / 10}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Position Distribution - Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 450 }}>
            <Typography variant="h6" gutterBottom>Position Distribution</Typography>
            <Divider sx={{ mb: 2 }} />
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={positionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {positionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Nation Analytics - Bar Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 450 }}>
            <Typography variant="h6" gutterBottom>Top 10 Nations by Player Count</Typography>
            <Divider sx={{ mb: 2 }} />
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={nationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#1976d2" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Top Teams - Bar Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: 450 }}>
            <Typography variant="h6" gutterBottom>Top Teams by Average Rating</Typography>
            <Divider sx={{ mb: 2 }} />
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={teamData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[70, 95]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="rating" name="Avg OVR" fill="#dc004e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
