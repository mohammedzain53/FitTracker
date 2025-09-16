import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert
} from '@mui/material';
import { Save, Person, MonitorWeight } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    profile: {
      firstName: '',
      lastName: '',
      age: '',
      height: '',
      gender: '',
      activityLevel: 'moderately_active'
    },
    goals: {
      targetWeight: '',
      weeklyWorkoutGoal: 3,
      dailyCalorieGoal: ''
    }
  });
  
  const [healthMetric, setHealthMetric] = useState({
    weight: '',
    bodyFatPercentage: '',
    muscleMass: '',
    restingHeartRate: '',
    sleepHours: '',
    waterIntake: '',
    stepsCount: '',
    notes: ''
  });
  
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        profile: user.profile || {
          firstName: '',
          lastName: '',
          age: '',
          height: '',
          gender: '',
          activityLevel: 'moderately_active'
        },
        goals: user.goals || {
          targetWeight: '',
          weeklyWorkoutGoal: 3,
          dailyCalorieGoal: ''
        }
      });
    }
    
    // Fetch latest health metrics
    fetchLatestMetrics();
  }, [user]);

  const fetchLatestMetrics = async () => {
    try {
      const response = await axios.get('/api/metrics/latest');
      if (response.data) {
        setHealthMetric({
          weight: response.data.weight || '',
          bodyFatPercentage: response.data.bodyFatPercentage || '',
          muscleMass: response.data.muscleMass || '',
          restingHeartRate: response.data.restingHeartRate || '',
          sleepHours: response.data.sleepHours || '',
          waterIntake: response.data.waterIntake || '',
          stepsCount: response.data.stepsCount || '',
          notes: response.data.notes || ''
        });
      }
    } catch (error) {
      console.error('Error fetching health metrics:', error);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1];
      setProfileData({
        ...profileData,
        profile: {
          ...profileData.profile,
          [profileField]: value
        }
      });
    } else if (name.startsWith('goals.')) {
      const goalField = name.split('.')[1];
      setProfileData({
        ...profileData,
        goals: {
          ...profileData.goals,
          [goalField]: value
        }
      });
    }
  };

  const handleHealthChange = (e) => {
    setHealthMetric({
      ...healthMetric,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.put('/api/auth/profile', profileData);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleHealthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Filter out empty values
      const filteredMetrics = Object.fromEntries(
        Object.entries(healthMetric).filter(([_, value]) => value !== '')
      );
      
      await axios.post('/api/metrics', filteredMetrics);
      setMessage('Health metrics saved successfully!');
    } catch (error) {
      setMessage('Error saving health metrics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile & Settings
      </Typography>

      {message && (
        <Alert 
          severity={message.includes('Error') ? 'error' : 'success'} 
          sx={{ mb: 3 }}
        >
          {message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <Person sx={{ mr: 1 }} />
              <Typography variant="h6">
                Profile Information
              </Typography>
            </Box>
            
            <form onSubmit={handleProfileSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="profile.firstName"
                    value={profileData.profile.firstName}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="profile.lastName"
                    value={profileData.profile.lastName}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Age"
                    name="profile.age"
                    type="number"
                    value={profileData.profile.age}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Height (cm)"
                    name="profile.height"
                    type="number"
                    value={profileData.profile.height}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      name="profile.gender"
                      value={profileData.profile.gender}
                      onChange={handleProfileChange}
                      label="Gender"
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Activity Level</InputLabel>
                    <Select
                      name="profile.activityLevel"
                      value={profileData.profile.activityLevel}
                      onChange={handleProfileChange}
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

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Fitness Goals
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Target Weight (kg)"
                    name="goals.targetWeight"
                    type="number"
                    value={profileData.goals.targetWeight}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Weekly Workout Goal"
                    name="goals.weeklyWorkoutGoal"
                    type="number"
                    value={profileData.goals.weeklyWorkoutGoal}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Daily Calorie Goal"
                    name="goals.dailyCalorieGoal"
                    type="number"
                    value={profileData.goals.dailyCalorieGoal}
                    onChange={handleProfileChange}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                sx={{ mt: 3 }}
                disabled={loading}
              >
                Save Profile
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Health Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <MonitorWeight sx={{ mr: 1 }} />
              <Typography variant="h6">
                Today's Health Metrics
              </Typography>
            </Box>
            
            <form onSubmit={handleHealthSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Weight (kg)"
                    name="weight"
                    type="number"
                    step="0.1"
                    value={healthMetric.weight}
                    onChange={handleHealthChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Body Fat %"
                    name="bodyFatPercentage"
                    type="number"
                    step="0.1"
                    value={healthMetric.bodyFatPercentage}
                    onChange={handleHealthChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Muscle Mass (kg)"
                    name="muscleMass"
                    type="number"
                    step="0.1"
                    value={healthMetric.muscleMass}
                    onChange={handleHealthChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Resting Heart Rate"
                    name="restingHeartRate"
                    type="number"
                    value={healthMetric.restingHeartRate}
                    onChange={handleHealthChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Sleep Hours"
                    name="sleepHours"
                    type="number"
                    step="0.5"
                    value={healthMetric.sleepHours}
                    onChange={handleHealthChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Water Intake (L)"
                    name="waterIntake"
                    type="number"
                    step="0.1"
                    value={healthMetric.waterIntake}
                    onChange={handleHealthChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Steps Count"
                    name="stepsCount"
                    type="number"
                    value={healthMetric.stepsCount}
                    onChange={handleHealthChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    name="notes"
                    multiline
                    rows={3}
                    value={healthMetric.notes}
                    onChange={handleHealthChange}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                sx={{ mt: 3 }}
                disabled={loading}
              >
                Save Health Metrics
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;