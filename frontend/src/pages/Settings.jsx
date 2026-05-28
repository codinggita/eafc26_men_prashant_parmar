import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  TextField,
  Card,
  CardContent,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { toggleTheme } from '../features/ui/uiSlice';
import { setUser } from '../features/auth/authSlice';
import api from '../services/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Use the existing update endpoint but for current user
      const response = await api.put(`/admin/users/${user._id}`, profileData);
      dispatch(setUser(response.data.data));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="animate-fade-in">
      <Helmet>
        <title>Settings | EA Sports FC 26</title>
      </Helmet>

      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Settings
      </Typography>

      <Grid container spacing={4}>
        {/* Appearance Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Appearance</Typography>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Customize how the dashboard looks on your device.
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={theme === 'dark'}
                    onChange={() => dispatch(toggleTheme())}
                    color="primary"
                  />
                }
                label={theme === 'dark' ? 'Dark Mode Enabled' : 'Light Mode Enabled'}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Profile Information</Typography>
              <Divider sx={{ mb: 3 }} />
              <Box component="form" onSubmit={handleProfileUpdate}>
                <TextField
                  fullWidth
                  label="Display Name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  value={profileData.email}
                  disabled
                  margin="normal"
                  helperText="Email cannot be changed."
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3 }}
                  disabled={loading || profileData.name === user?.name}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings Placeholder */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Notifications</Typography>
              <Divider sx={{ mb: 3 }} />
              <FormControlLabel
                control={<Switch defaultChecked disabled />}
                label="Email Alerts"
              />
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Get notified when players are updated (Coming Soon).
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings Placeholder */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Security</Typography>
              <Divider sx={{ mb: 3 }} />
              <Button variant="outlined" color="primary" disabled>
                Change Password
              </Button>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Two-factor authentication and password management features are under development.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
