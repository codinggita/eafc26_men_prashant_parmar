import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemIcon, 
  ListItemText, 
  Divider,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SoccerIcon from '@mui/icons-material/SportsSoccer';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/Brightness4';
import LightModeIcon from '@mui/icons-material/Brightness7';
import { toggleSidebar, toggleTheme } from '../features/ui/uiSlice';
import { logout } from '../features/auth/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, theme } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleMenuClose();
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Users Management', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Players Dataset', icon: <SoccerIcon />, path: '/players' },
    { text: 'Compare Players', icon: <CompareArrowsIcon />, path: '/compare' },
    { text: 'Analytics', icon: <ChartIcon />, path: '/analytics' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          ...(sidebarOpen && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: (theme) =>
              theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => dispatch(toggleSidebar())}
            edge="start"
            sx={{ marginRight: 5, ...(sidebarOpen && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            EA Sports FC 26
          </Typography>
          
          <IconButton color="inherit" onClick={() => dispatch(toggleTheme())}>
            {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <IconButton onClick={handleMenuOpen} sx={{ p: 0, ml: 2 }}>
            <Avatar alt={user?.name || 'User'} src={user?.avatar} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{ mt: '45px' }}
          >
            <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={sidebarOpen}
        sx={{
          width: sidebarOpen ? drawerWidth : 64,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          '& .MuiDrawer-paper': {
            width: sidebarOpen ? drawerWidth : 64,
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            overflowX: 'hidden',
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={() => dispatch(toggleSidebar())}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  minHeight: 48,
                  justifyContent: sidebarOpen ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: sidebarOpen ? 3 : 'auto',
                    justifyContent: 'center',
                    color: location.pathname === item.path ? 'primary.main' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    opacity: sidebarOpen ? 1 : 0,
                    color: location.pathname === item.path ? 'primary.main' : 'inherit',
                  }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${sidebarOpen ? drawerWidth : 64}px)` },
          minHeight: '100vh',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
