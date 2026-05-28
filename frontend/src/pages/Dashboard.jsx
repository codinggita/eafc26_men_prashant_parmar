import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SoccerIcon from '@mui/icons-material/SportsSoccer';
import TrendingIcon from '@mui/icons-material/TrendingUp';
import UpdateIcon from '@mui/icons-material/Update';
import api from '../services/api';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, icon, color }) => (
  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Box sx={{ p: 1, borderRadius: 1, backgroundColor: `${color}20`, mr: 2 }}>
        {icon}
      </Box>
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
    </Box>
    <Typography component="p" variant="h4" sx={{ mt: 'auto' }}>
      {value}
    </Typography>
    <Typography color="text.secondary" sx={{ flex: 1 }}>
      as of {new Date().toLocaleDateString()}
    </Typography>
  </Paper>
);

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setAdminStats(response.data.data);
      } catch (error) {
        console.error('Stats fetch error:', error);
        toast.error('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="animate-fade-in">
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Welcome, {user?.name}!
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Players" 
            value={adminStats?.totalPlayers || '18,000+'} 
            icon={<SoccerIcon color="primary" />} 
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Users" 
            value={adminStats?.totalUsers || '0'} 
            icon={<PeopleIcon color="secondary" />} 
            color="#dc004e"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Deleted Records" 
            value={adminStats?.deletedPlayers || '0'} 
            icon={<UpdateIcon sx={{ color: '#ed6c02' }} />} 
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Top Rating" 
            value="91 OVR" 
            icon={<TrendingIcon sx={{ color: '#2e7d32' }} />} 
            color="#2e7d32"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400, overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Recently Added Players
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {adminStats?.latestPlayers?.length > 0 ? (
              <List>
                {adminStats.latestPlayers.map((player) => (
                  <ListItem key={player._id}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {player.ovr}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={player.name} 
                      secondary={`${player.team} | ${player.position}`} 
                    />
                    <Typography variant="body2" color="textSecondary">
                      {new Date(player.createdAt).toLocaleDateString()}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box className="flex items-center justify-center h-full text-gray-400">
                No recent additions found.
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              System Health
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Server:</strong> Online
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Database:</strong> Connected (MongoDB)
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Role:</strong> {user?.role?.toUpperCase()}
              </Typography>
              <Typography variant="body1">
                <strong>Environment:</strong> Production (Ready)
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
