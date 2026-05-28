import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import SecurityIcon from '@mui/icons-material/Security';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Box className="animate-fade-in">
      <Helmet>
        <title>Profile | EA Sports FC 26</title>
      </Helmet>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        User Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: 'primary.main',
                fontSize: '3rem',
                mb: 2,
              }}
            >
              {user?.name?.charAt(0)}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {user?.name}
            </Typography>
            <Chip
              label={user?.role?.toUpperCase()}
              color={user?.role === 'admin' ? 'error' : 'success'}
              sx={{ mt: 1, fontWeight: 'bold' }}
              size="small"
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Account Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <List disablePadding>
              <ListItem sx={{ px: 0, py: 2 }}>
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Full Name"
                  secondary={user?.name}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              
              <ListItem sx={{ px: 0, py: 2 }}>
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Email Address"
                  secondary={user?.email}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              
              <ListItem sx={{ px: 0, py: 2 }}>
                <ListItemIcon>
                  <SecurityIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Role"
                  secondary={user?.role === 'admin' ? 'Administrator' : 'Standard User'}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              
              <ListItem sx={{ px: 0, py: 2 }}>
                <ListItemIcon>
                  <CalendarTodayIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Account Created"
                  secondary={new Date(user?.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
