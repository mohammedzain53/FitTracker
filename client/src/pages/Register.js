import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { FitnessCenter } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profile: {
      firstName: '',
      lastName: '',
      age: '',
      height: '',
      gender: '',
      activityLevel: 'moderately_active'
    }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1];
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          [profileField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const { confirmPassword, ...registrationData } = formData;
    const result = await register(registrationData);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="md" sx={{ px: isMobile ? 1 : 3 }}>
      <Box
        sx={{
          marginTop: isMobile ? 2 : 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: isMobile ? 2 : 4, width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <FitnessCenter sx={{ fontSize: isMobile ? 32 : 40, color: 'primary.main', mb: 2 }} />
            <Typography component="h1" variant={isMobile ? "h5" : "h4"} gutterBottom>
              Sign Up
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <Grid container spacing={isMobile ? 1 : 2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="username"
                    label="Username"
                    value={formData.username}
                    onChange={handleChange}
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant={isMobile ? "h6" : "h6"} gutterBottom sx={{ mt: 2 }}>
                    Profile Information
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="profile.firstName"
                    label="First Name"
                    value={formData.profile.firstName}
                    onChange={handleChange}
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="profile.lastName"
                    label="Last Name"
                    value={formData.profile.lastName}
                    onChange={handleChange}
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="profile.age"
                    label="Age"
                    type="number"
                    value={formData.profile.age}
                    onChange={handleChange}
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="profile.height"
                    label="Height (cm)"
                    type="number"
                    value={formData.profile.height}
                    onChange={handleChange}
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      name="profile.gender"
                      value={formData.profile.gender}
                      onChange={handleChange}
                      label="Gender"
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                    <InputLabel>Activity Level</InputLabel>
                    <Select
                      name="profile.activityLevel"
                      value={formData.profile.activityLevel}
                      onChange={handleChange}
                      label="Activity Level"
                    >
                      <MenuItem value="sedentary">Sedentary</MenuItem>
                      <MenuItem value="lightly_active">Lightly Active</MenuItem>
                      <MenuItem value="moderately_active">Moderately Active</MenuItem>
                      <MenuItem value="very_active">Very Active</MenuItem>
                      <MenuItem value="extremely_active">Extremely Active</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size={isMobile ? "large" : "large"}
                sx={{ mt: 3, mb: 2, py: isMobile ? 1.5 : 2 }}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
              
              <Box textAlign="center">
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/login')}
                  type="button"
                  sx={{ fontSize: isMobile ? '0.875rem' : '0.875rem' }}
                >
                  Already have an account? Sign In
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;