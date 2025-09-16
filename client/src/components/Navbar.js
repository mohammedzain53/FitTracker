import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  FormControlLabel,
  Avatar,
  Chip
} from '@mui/material';
import { 
  FitnessCenter, 
  AccountCircle,
  Dashboard,
  Analytics,
  DirectionsRun,
  DarkMode,
  LightMode,
  Person
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: <Dashboard /> },
    { label: 'Workouts', path: '/workouts', icon: <DirectionsRun /> },
    { label: 'Analytics', path: '/analytics', icon: <Analytics /> },
  ];

  if (!user) {
    return (
      <AppBar 
        position="fixed" 
        sx={{
          zIndex: 1100, 
          background: darkMode 
            ? 'rgba(44, 83, 100, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: darkMode 
            ? '2px solid rgba(192, 192, 192, 0.3)'
            : '1px solid rgba(46, 204, 113, 0.2)',
          boxShadow: darkMode 
            ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 23, 68, 0.2)'
            : '0 4px 20px rgba(46, 204, 113, 0.1)',
        }}
      >
        <Toolbar sx={{ py: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mr: 2,
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.05)' },
            },
          }}>
            <FitnessCenter sx={{ 
              mr: 1, 
              fontSize: 36,
              background: darkMode 
                ? 'linear-gradient(135deg, #FF1744 0%, #D50000 100%)'
                : 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: darkMode 
                ? 'drop-shadow(0 2px 8px rgba(255, 23, 68, 0.5))'
                : 'drop-shadow(0 2px 4px rgba(46, 204, 113, 0.3))',
            }} />
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 800,
                background: darkMode 
                  ? 'linear-gradient(135deg, #FF1744 0%, #D50000 100%)'
                  : 'linear-gradient(135deg, #2ECC71 0%, #3498DB 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: darkMode 
                  ? 'drop-shadow(0 2px 8px rgba(255, 23, 68, 0.5))'
                  : 'drop-shadow(0 2px 4px rgba(46, 204, 113, 0.3))',
              }}
            >
              FitTracker
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={toggleTheme} 
              sx={{
                color: darkMode ? '#C0C0C0' : '#2C3E50',
                background: darkMode 
                  ? 'rgba(255, 23, 68, 0.1)'
                  : 'rgba(46, 204, 113, 0.1)',
                backdropFilter: 'blur(10px)',
                border: darkMode 
                  ? '2px solid rgba(192, 192, 192, 0.3)'
                  : '1px solid rgba(46, 204, 113, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: darkMode 
                    ? 'rgba(255, 23, 68, 0.2)'
                    : 'rgba(52, 152, 219, 0.1)',
                  color: darkMode ? '#FFD600' : '#3498DB',
                  border: darkMode 
                    ? '2px solid rgba(255, 214, 0, 0.5)'
                    : '1px solid rgba(52, 152, 219, 0.5)',
                  transform: 'scale(1.1) rotate(180deg)',
                  boxShadow: darkMode 
                    ? '0 0 20px rgba(255, 214, 0, 0.4)'
                    : '0 0 15px rgba(52, 152, 219, 0.3)',
                },
              }}
            >
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
            
            {location.pathname !== '/login' && (
              <Button 
                onClick={() => navigate('/login')}
                variant="outlined"
                sx={{ 
                  color: darkMode ? '#C0C0C0' : '#2C3E50',
                  borderColor: darkMode 
                    ? 'rgba(192, 192, 192, 0.4)'
                    : 'rgba(46, 204, 113, 0.4)',
                  background: darkMode 
                    ? 'rgba(44, 83, 100, 0.8)'
                    : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  fontWeight: 600,
                  '&:hover': { 
                    borderColor: darkMode 
                      ? 'rgba(255, 214, 0, 0.7)'
                      : 'rgba(52, 152, 219, 0.7)',
                    background: darkMode 
                      ? 'rgba(44, 83, 100, 0.9)'
                      : 'rgba(255, 255, 255, 1)',
                    color: darkMode ? '#FFD600' : '#3498DB',
                    transform: 'translateY(-2px)',
                    boxShadow: darkMode 
                      ? '0 4px 15px rgba(255, 214, 0, 0.3)'
                      : '0 4px 15px rgba(52, 152, 219, 0.2)',
                  }
                }}
              >
                Login
              </Button>
            )}
            {location.pathname !== '/register' && (
              <Button 
                onClick={() => navigate('/register')}
                variant="contained"
                sx={{ 
                  background: darkMode 
                    ? 'linear-gradient(135deg, #FF1744 0%, #D50000 100%)'
                    : 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
                  boxShadow: darkMode 
                    ? '0 4px 15px rgba(255, 23, 68, 0.5), 0 0 20px rgba(255, 23, 68, 0.3)'
                    : '0 4px 15px rgba(46, 204, 113, 0.3)',
                  '&:hover': { 
                    background: darkMode 
                      ? 'linear-gradient(135deg, #FF5983 0%, #FF1744 100%)'
                      : 'linear-gradient(135deg, #58D68D 0%, #2ECC71 100%)',
                    boxShadow: darkMode 
                      ? '0 6px 25px rgba(255, 23, 68, 0.7), 0 0 30px rgba(255, 23, 68, 0.5)'
                      : '0 6px 20px rgba(46, 204, 113, 0.4)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                Register
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar 
      position="fixed" 
      sx={{
        zIndex: 1100, 
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar sx={{ py: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mr: 3,
          animation: 'pulse 2s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.05)' },
          },
        }}>
          <FitnessCenter sx={{ 
            mr: 1, 
            fontSize: 36,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }} />
          <Typography 
            variant="h4" 
            component="div" 
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}
          >
            FitTracker
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{ 
                mx: 0.5,
                px: 3,
                py: 1.5,
                borderRadius: 3,
                color: darkMode ? '#C0C0C0' : '#2C3E50',
                background: location.pathname === item.path 
                  ? (darkMode ? 'rgba(255, 23, 68, 0.2)' : 'rgba(46, 204, 113, 0.15)')
                  : (darkMode ? 'rgba(44, 83, 100, 0.8)' : 'rgba(255, 255, 255, 0.8)'),
                backdropFilter: 'blur(10px)',
                border: location.pathname === item.path 
                  ? (darkMode ? '2px solid rgba(255, 23, 68, 0.5)' : '1px solid rgba(46, 204, 113, 0.5)')
                  : (darkMode ? '1px solid rgba(192, 192, 192, 0.2)' : '1px solid rgba(46, 204, 113, 0.2)'),
                transition: 'all 0.3s ease',
                '&:hover': { 
                  background: darkMode 
                    ? 'rgba(255, 23, 68, 0.2)'
                    : 'rgba(52, 152, 219, 0.15)',
                  color: darkMode ? '#FFD600' : '#3498DB',
                  border: darkMode 
                    ? '2px solid rgba(255, 214, 0, 0.5)'
                    : '1px solid rgba(52, 152, 219, 0.5)',
                  transform: 'translateY(-2px)',
                  boxShadow: darkMode 
                    ? '0 4px 15px rgba(255, 214, 0, 0.3)'
                    : '0 4px 15px rgba(52, 152, 219, 0.2)',
                },
                fontWeight: location.pathname === item.path ? 700 : 500,
                fontSize: '0.95rem',
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={toggleTheme} 
            sx={{
              color: 'white',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.1) rotate(180deg)',
              },
            }}
          >
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
          
          <Chip
            avatar={
              <Avatar sx={{ 
                background: darkMode 
                  ? 'linear-gradient(135deg, #FF1744 0%, #D50000 100%)'
                  : 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
                width: 32,
                height: 32,
                boxShadow: darkMode 
                  ? '0 0 15px rgba(255, 23, 68, 0.5)'
                  : '0 0 10px rgba(46, 204, 113, 0.3)',
              }}>
                <Person />
              </Avatar>
            }
            label={user.username}
            sx={{ 
              color: darkMode ? '#C0C0C0' : '#2C3E50', 
              background: darkMode 
                ? 'rgba(44, 83, 100, 0.9)'
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: darkMode 
                ? '2px solid rgba(192, 192, 192, 0.3)'
                : '1px solid rgba(46, 204, 113, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                background: darkMode 
                  ? 'rgba(44, 83, 100, 0.95)'
                  : 'rgba(255, 255, 255, 1)',
                color: darkMode ? '#FFD600' : '#2ECC71',
                border: darkMode 
                  ? '2px solid rgba(255, 214, 0, 0.5)'
                  : '1px solid rgba(46, 204, 113, 0.5)',
                transform: 'scale(1.05)',
                boxShadow: darkMode 
                  ? '0 0 20px rgba(255, 214, 0, 0.4)'
                  : '0 0 15px rgba(46, 204, 113, 0.3)',
              },
              '& .MuiChip-label': {
                fontWeight: 600,
                fontSize: '0.9rem',
              },
            }}
            onClick={handleMenu}
          />
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              '& .MuiPaper-root': {
                borderRadius: 3,
                mt: 1,
                minWidth: 200,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              },
              '& .MuiMenuItem-root': {
                color: 'white',
                borderRadius: 2,
                margin: '4px 8px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateX(4px)',
                },
              },
            }}
          >
            <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
              <Person sx={{ mr: 2 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <AccountCircle sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;