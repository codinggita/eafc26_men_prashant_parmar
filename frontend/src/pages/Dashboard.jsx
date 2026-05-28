import { Grid, Paper, Typography, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SoccerIcon from '@mui/icons-material/SportsSoccer';
import TrendingIcon from '@mui/icons-material/TrendingUp';
import UpdateIcon from '@mui/icons-material/Update';

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
      on May 28, 2026
    </Typography>
  </Paper>
);

const Dashboard = () => {
  return (
    <Box className="animate-fade-in">
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Players" 
            value="18,000+" 
            icon={<SoccerIcon color="primary" />} 
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Users" 
            value="1,250" 
            icon={<PeopleIcon color="secondary" />} 
            color="#dc004e"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Top Rated" 
            value="91 OVR" 
            icon={<TrendingIcon sx={{ color: '#2e7d32' }} />} 
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Recent Updates" 
            value="45" 
            icon={<UpdateIcon sx={{ color: '#ed6c02' }} />} 
            color="#ed6c02"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Recent Player Additions
            </Typography>
            <div className="flex items-center justify-center h-full text-gray-400">
              [Analytics Chart Placeholder]
            </div>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Dataset Distribution
            </Typography>
            <div className="flex items-center justify-center h-full text-gray-400">
              [Pie Chart Placeholder]
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
