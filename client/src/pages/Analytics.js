import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  useMediaQuery,
  useTheme as useMuiTheme
} from '@mui/material';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import axios from 'axios';
import WorkoutHeatmap from '../components/WorkoutHeatmap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const { darkMode } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [workoutAnalytics, setWorkoutAnalytics] = useState(null);
  const [healthAnalytics, setHealthAnalytics] = useState(null);
  const [period, setPeriod] = useState('30');
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [workoutRes, healthRes] = await Promise.all([
        axios.get(`/api/analytics/workouts?period=${period}`),
        axios.get(`/api/analytics/health?period=${period}`)
      ]);
      
      setWorkoutAnalytics(workoutRes.data);
      setHealthAnalytics(healthRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  // Use appropriate trend data based on period
  const trendData = workoutAnalytics?.dailyTrend || workoutAnalytics?.weeklyTrend || [];
  
  // Workout Trends Chart
  const workoutTrendData = {
    labels: trendData.map(item => 
      item._id.date ? new Date(item._id.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) :
      `Week ${item._id.week}`
    ),
    datasets: [
      {
        label: 'Workouts',
        data: trendData.map(item => item.workouts) || [],
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#1976d2',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        tension: 0.4,
        fill: true
      },
      {
        label: 'Total Duration (hours)',
        data: trendData.map(item => Math.round(item.duration / 60)) || [],
        borderColor: '#dc004e',
        backgroundColor: 'rgba(220, 0, 78, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#dc004e',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Category Breakdown Chart
  const categoryData = {
    labels: workoutAnalytics?.categoryBreakdown?.map(item => 
      item._id.charAt(0).toUpperCase() + item._id.slice(1)
    ) || [],
    datasets: [
      {
        data: workoutAnalytics?.categoryBreakdown?.map(item => item.count) || [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6B6B',
          '#4ECDC4'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6B6B',
          '#4ECDC4'
        ],
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverBorderWidth: 4
      }
    ]
  };

  // Calories Burned Chart
  const caloriesData = {
    labels: trendData.map(item => 
      item._id.date ? new Date(item._id.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) :
      `Week ${item._id.week}`
    ),
    datasets: [
      {
        label: 'Calories Burned',
        data: trendData.map(item => item.calories) || [],
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  // Weight Trend Chart
  const weightTrendData = {
    labels: healthAnalytics?.weightTrend?.map(item => 
      new Date(item.date).toLocaleDateString()
    ) || [],
    datasets: [
      {
        label: 'Weight (kg)',
        data: healthAnalytics?.weightTrend?.map(item => item.value) || [],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            weight: 'bold'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0,0,0,0.1)'
        },
        ticks: {
          font: {
            weight: 'bold'
          }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: isMobile ? 2 : 4, mb: 4, px: isMobile ? 1 : 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={isMobile ? 2 : 4} flexWrap="wrap" gap={2}>
        <Typography variant={isMobile ? "h5" : "h4"} component="h1">
          Analytics & Insights
        </Typography>
        <FormControl sx={{ minWidth: isMobile ? 100 : 120 }} size={isMobile ? "small" : "medium"}>
          <InputLabel>Period</InputLabel>
          <Select
            value={period}
            label="Period"
            onChange={(e) => setPeriod(e.target.value)}
          >
            <MenuItem value="7">7 days</MenuItem>
            <MenuItem value="30">30 days</MenuItem>
            <MenuItem value="90">90 days</MenuItem>
            <MenuItem value="365">1 year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Stats */}
        <Grid item xs={12}>
          <Paper sx={{ 
            p: isMobile ? 2 : 5, 
            background: darkMode 
              ? 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)'
              : 'linear-gradient(135deg, #2ECC71 0%, #3498DB 50%, #9B59B6 100%)',
            color: 'white',
            borderRadius: isMobile ? 3 : 4,
            boxShadow: darkMode 
              ? '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(255, 23, 68, 0.2)'
              : '0 20px 60px rgba(46, 204, 113, 0.3), 0 0 40px rgba(52, 152, 219, 0.2)',
            border: darkMode 
              ? '2px solid rgba(192, 192, 192, 0.2)'
              : '2px solid rgba(255, 255, 255, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: darkMode 
                ? 'radial-gradient(circle at 30% 70%, rgba(255, 23, 68, 0.3), transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 214, 0, 0.2), transparent 50%)'
                : 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.2), transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 107, 53, 0.3), transparent 50%)',
              animation: 'float 8s ease-in-out infinite',
              zIndex: 0,
            },
            '@keyframes float': {
              '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
              '50%': { transform: 'scale(1.05) rotate(2deg)' },
            },
          }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ 
                fontWeight: 800, 
                textAlign: 'center', 
                mb: isMobile ? 3 : 4,
                textShadow: '0 3px 6px rgba(0,0,0,0.3)',
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                fontSize: isMobile ? '1.5rem' : '2rem',
              }}>
                📊 Analytics Summary ({period} days)
              </Typography>
              <Grid container spacing={isMobile ? 2 : 4}>
                <Grid item xs={6} sm={6} md={3}>
                  <Box textAlign="center" sx={{ 
                    p: isMobile ? 2 : 4, 
                    background: darkMode 
                      ? 'linear-gradient(145deg, rgba(255, 23, 68, 0.2), rgba(255, 23, 68, 0.1))'
                      : 'linear-gradient(145deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))', 
                    borderRadius: isMobile ? 2 : 3,
                    backdropFilter: 'blur(20px)',
                    border: darkMode 
                      ? '1px solid rgba(255, 23, 68, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: darkMode 
                      ? '0 8px 25px rgba(255, 23, 68, 0.2)'
                      : '0 8px 25px rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: isMobile ? 'scale(1.02)' : 'translateY(-5px) scale(1.02)',
                      boxShadow: darkMode 
                        ? '0 15px 35px rgba(255, 23, 68, 0.3)'
                        : '0 15px 35px rgba(255, 255, 255, 0.3)',
                    },
                  }}>
                    <Typography variant={isMobile ? "h3" : "h2"} sx={{ 
                      fontWeight: 900, 
                      mb: isMobile ? 1 : 2,
                      background: darkMode 
                        ? 'linear-gradient(135deg, #FF1744 0%, #FFD600 100%)'
                        : 'linear-gradient(135deg, #ffffff 0%, #FF6B35 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      fontSize: isMobile ? '2rem' : '2.5rem',
                    }}>
                      {workoutAnalytics?.summary?.totalWorkouts || 0}
                    </Typography>
                    <Typography variant={isMobile ? "body2" : "body1"} sx={{ 
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.9)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      fontSize: isMobile ? '0.75rem' : '1rem',
                    }}>
                      Total Workouts
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <Box textAlign="center" sx={{ 
                    p: isMobile ? 2 : 4, 
                    background: darkMode 
                      ? 'linear-gradient(145deg, rgba(192, 192, 192, 0.2), rgba(192, 192, 192, 0.1))'
                      : 'linear-gradient(145deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))', 
                    borderRadius: isMobile ? 2 : 3,
                    backdropFilter: 'blur(20px)',
                    border: darkMode 
                      ? '1px solid rgba(192, 192, 192, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: darkMode 
                      ? '0 8px 25px rgba(192, 192, 192, 0.2)'
                      : '0 8px 25px rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: isMobile ? 'scale(1.02)' : 'translateY(-5px) scale(1.02)',
                      boxShadow: darkMode 
                        ? '0 15px 35px rgba(192, 192, 192, 0.3)'
                        : '0 15px 35px rgba(255, 255, 255, 0.3)',
                    },
                  }}>
                    <Typography variant={isMobile ? "h3" : "h2"} sx={{ 
                      fontWeight: 900, 
                      mb: isMobile ? 1 : 2,
                      background: darkMode 
                        ? 'linear-gradient(135deg, #C0C0C0 0%, #FFD600 100%)'
                        : 'linear-gradient(135deg, #ffffff 0%, #FF6B35 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      fontSize: isMobile ? '2rem' : '2.5rem',
                    }}>
                      {workoutAnalytics?.summary?.totalCalories || 0}
                    </Typography>
                    <Typography variant={isMobile ? "body2" : "body1"} sx={{ 
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.9)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      fontSize: isMobile ? '0.75rem' : '1rem',
                    }}>
                      Calories Burned
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <Box textAlign="center" sx={{ 
                    p: isMobile ? 2 : 4, 
                    background: darkMode 
                      ? 'linear-gradient(145deg, rgba(255, 214, 0, 0.2), rgba(255, 214, 0, 0.1))'
                      : 'linear-gradient(145deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))', 
                    borderRadius: isMobile ? 2 : 3,
                    backdropFilter: 'blur(20px)',
                    border: darkMode 
                      ? '1px solid rgba(255, 214, 0, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: darkMode 
                      ? '0 8px 25px rgba(255, 214, 0, 0.2)'
                      : '0 8px 25px rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: isMobile ? 'scale(1.02)' : 'translateY(-5px) scale(1.02)',
                      boxShadow: darkMode 
                        ? '0 15px 35px rgba(255, 214, 0, 0.3)'
                        : '0 15px 35px rgba(255, 255, 255, 0.3)',
                    },
                  }}>
                    <Typography variant={isMobile ? "h3" : "h2"} sx={{ 
                      fontWeight: 900, 
                      mb: isMobile ? 1 : 2,
                      background: darkMode 
                        ? 'linear-gradient(135deg, #FFD600 0%, #FF1744 100%)'
                        : 'linear-gradient(135deg, #ffffff 0%, #FF6B35 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      fontSize: isMobile ? '2rem' : '2.5rem',
                    }}>
                      {Math.round((workoutAnalytics?.summary?.totalDuration || 0) / 60)}
                    </Typography>
                    <Typography variant={isMobile ? "body2" : "body1"} sx={{ 
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.9)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      fontSize: isMobile ? '0.75rem' : '1rem',
                    }}>
                      Hours Exercised
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <Box textAlign="center" sx={{ 
                    p: isMobile ? 2 : 4, 
                    background: darkMode 
                      ? 'linear-gradient(145deg, rgba(255, 23, 68, 0.15), rgba(192, 192, 192, 0.15))'
                      : 'linear-gradient(145deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))', 
                    borderRadius: isMobile ? 2 : 3,
                    backdropFilter: 'blur(20px)',
                    border: darkMode 
                      ? '1px solid rgba(255, 23, 68, 0.2)'
                      : '1px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: darkMode 
                      ? '0 8px 25px rgba(255, 23, 68, 0.15)'
                      : '0 8px 25px rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: isMobile ? 'scale(1.02)' : 'translateY(-5px) scale(1.02)',
                      boxShadow: darkMode 
                        ? '0 15px 35px rgba(255, 23, 68, 0.25)'
                        : '0 15px 35px rgba(255, 255, 255, 0.3)',
                    },
                  }}>
                    <Typography variant={isMobile ? "h3" : "h2"} sx={{ 
                      fontWeight: 900, 
                      mb: isMobile ? 1 : 2,
                      background: darkMode 
                        ? 'linear-gradient(135deg, #FF1744 0%, #C0C0C0 100%)'
                        : 'linear-gradient(135deg, #ffffff 0%, #FF6B35 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      fontSize: isMobile ? '2rem' : '2.5rem',
                    }}>
                      {Math.round(workoutAnalytics?.summary?.avgCaloriesPerWorkout || 0)}
                    </Typography>
                    <Typography variant={isMobile ? "body2" : "body1"} sx={{ 
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.9)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      fontSize: isMobile ? '0.75rem' : '1rem',
                    }}>
                      Avg Cal/Workout
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Workout Trends */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333', mb: 3 }}>
              📈 Workout Trends
            </Typography>
            {trendData?.length > 0 ? (
              <Box sx={{ height: 350 }}>
                <Line data={workoutTrendData} options={chartOptions} />
              </Box>
            ) : (
              <Box textAlign="center" py={8}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No workout data available for the selected period
                </Typography>
                <Typography color="textSecondary">
                  Start logging workouts to see trends!
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Exercise Categories */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
          }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333', mb: 3 }}>
              🎯 Exercise Categories
            </Typography>
            {workoutAnalytics?.categoryBreakdown?.length > 0 ? (
              <Box sx={{ height: 350 }}>
                <Doughnut data={categoryData} options={doughnutOptions} />
              </Box>
            ) : (
              <Box textAlign="center" py={8}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No category data available
                </Typography>
                <Typography color="textSecondary">
                  Add exercises to see category breakdown!
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Calories Burned */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
          }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333', mb: 3 }}>
              🔥 Weekly Calories Burned
            </Typography>
            {trendData?.length > 0 ? (
              <Box sx={{ height: 300 }}>
                <Bar data={caloriesData} options={chartOptions} />
              </Box>
            ) : (
              <Box textAlign="center" py={6}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No calorie data available
                </Typography>
                <Typography color="textSecondary">
                  Log workouts to track calories!
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Weight Trend */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)'
          }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333', mb: 3 }}>
              ⚖️ Weight Progress
            </Typography>
            {healthAnalytics?.weightTrend?.length > 0 ? (
              <Box sx={{ height: 300 }}>
                <Line data={weightTrendData} options={chartOptions} />
              </Box>
            ) : (
              <Box textAlign="center" py={6}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No weight data available
                </Typography>
                <Typography color="textSecondary">
                  Start tracking your weight in the profile section!
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Workout Heatmap */}
        <Grid item xs={12}>
          <WorkoutHeatmap />
        </Grid>

        {/* Health Metrics Summary */}
        <Grid item xs={12}>
          <Paper sx={{ 
            p: 4,
            borderRadius: 3,
            background: darkMode 
              ? 'rgba(44, 83, 100, 0.9)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: darkMode 
              ? '1px solid rgba(255, 255, 255, 0.2)'
              : '1px solid rgba(46, 204, 113, 0.2)',
            boxShadow: darkMode 
              ? '0 8px 32px rgba(0, 0, 0, 0.4)'
              : '0 8px 32px rgba(46, 204, 113, 0.1)',
          }}>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                color: darkMode ? '#ffffff' : '#2C3E50',
                mb: 3,
                textAlign: 'center'
              }}
            >
              📊 Health Metrics Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center" sx={{
                  p: 3,
                  background: darkMode 
                    ? 'rgba(255, 23, 68, 0.1)'
                    : 'rgba(46, 204, 113, 0.1)',
                  borderRadius: 2,
                  border: darkMode 
                    ? '1px solid rgba(255, 23, 68, 0.2)'
                    : '1px solid rgba(46, 204, 113, 0.2)',
                }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800,
                      color: darkMode ? '#FF1744' : '#2ECC71',
                      mb: 1
                    }}
                  >
                    {healthAnalytics?.weightTrend?.length || 0}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(44, 62, 80, 0.8)',
                      fontWeight: 600
                    }}
                  >
                    Weight Records
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center" sx={{
                  p: 3,
                  background: darkMode 
                    ? 'rgba(192, 192, 192, 0.1)'
                    : 'rgba(52, 152, 219, 0.1)',
                  borderRadius: 2,
                  border: darkMode 
                    ? '1px solid rgba(192, 192, 192, 0.2)'
                    : '1px solid rgba(52, 152, 219, 0.2)',
                }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800,
                      color: darkMode ? '#C0C0C0' : '#3498DB',
                      mb: 1
                    }}
                  >
                    {healthAnalytics?.sleepTrend?.length || 0}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(44, 62, 80, 0.8)',
                      fontWeight: 600
                    }}
                  >
                    Sleep Records
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center" sx={{
                  p: 3,
                  background: darkMode 
                    ? 'rgba(255, 214, 0, 0.1)'
                    : 'rgba(255, 107, 53, 0.1)',
                  borderRadius: 2,
                  border: darkMode 
                    ? '1px solid rgba(255, 214, 0, 0.2)'
                    : '1px solid rgba(255, 107, 53, 0.2)',
                }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800,
                      color: darkMode ? '#FFD600' : '#FF6B35',
                      mb: 1
                    }}
                  >
                    {healthAnalytics?.stepsTrend?.length || 0}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(44, 62, 80, 0.8)',
                      fontWeight: 600
                    }}
                  >
                    Step Records
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Analytics;