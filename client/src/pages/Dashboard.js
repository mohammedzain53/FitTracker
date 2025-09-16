import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import {
  FitnessCenter,
  LocalFireDepartment,
  TrendingUp,
  MonitorWeight
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => (
  <Card sx={{ 
    height: '100%',
    background: `linear-gradient(135deg, ${
      color === 'primary' ? 'rgba(99, 102, 241, 0.1)' : 
      color === 'secondary' ? 'rgba(236, 72, 153, 0.1)' : 
      color === 'success' ? 'rgba(16, 185, 129, 0.1)' : 
      'rgba(59, 130, 246, 0.1)'
    }, ${
      color === 'primary' ? 'rgba(99, 102, 241, 0.05)' : 
      color === 'secondary' ? 'rgba(236, 72, 153, 0.05)' : 
      color === 'success' ? 'rgba(16, 185, 129, 0.05)' : 
      'rgba(59, 130, 246, 0.05)'
    })`,
    border: `1px solid ${
      color === 'primary' ? 'rgba(99, 102, 241, 0.2)' : 
      color === 'secondary' ? 'rgba(236, 72, 153, 0.2)' : 
      color === 'success' ? 'rgba(16, 185, 129, 0.2)' : 
      'rgba(59, 130, 246, 0.2)'
    }`,
    backdropFilter: 'blur(20px)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(45deg, ${
        color === 'primary' ? 'rgba(99, 102, 241, 0.1)' : 
        color === 'secondary' ? 'rgba(236, 72, 153, 0.1)' : 
        color === 'success' ? 'rgba(16, 185, 129, 0.1)' : 
        'rgba(59, 130, 246, 0.1)'
      }, transparent)`,
      opacity: 0,
      transition: 'opacity 0.3s ease',
    },
    '&:hover::before': {
      opacity: 1,
    },
    '&:hover': {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
  }}>
    <CardContent sx={{ position: 'relative', zIndex: 1 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography 
            color="textSecondary" 
            gutterBottom 
            variant="body2" 
            sx={{ 
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '0.75rem',
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h2" 
            component="div" 
            sx={{ 
              fontWeight: 800,
              background: `linear-gradient(135deg, ${
                color === 'primary' ? '#6366f1' : 
                color === 'secondary' ? '#ec4899' : 
                color === 'success' ? '#10b981' : 
                '#3b82f6'
              }, ${
                color === 'primary' ? '#8b5cf6' : 
                color === 'secondary' ? '#f472b6' : 
                color === 'success' ? '#34d399' : 
                '#60a5fa'
              })`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography 
              variant="body2" 
              color="textSecondary" 
              sx={{ 
                fontWeight: 500,
                opacity: 0.8,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ 
          background: `linear-gradient(135deg, ${
            color === 'primary' ? '#6366f1' : 
            color === 'secondary' ? '#ec4899' : 
            color === 'success' ? '#10b981' : 
            '#3b82f6'
          }, ${
            color === 'primary' ? '#8b5cf6' : 
            color === 'secondary' ? '#f472b6' : 
            color === 'success' ? '#34d399' : 
            '#60a5fa'
          })`,
          borderRadius: '20px',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 8px 25px ${
            color === 'primary' ? 'rgba(99, 102, 241, 0.3)' : 
            color === 'secondary' ? 'rgba(236, 72, 153, 0.3)' : 
            color === 'success' ? 'rgba(16, 185, 129, 0.3)' : 
            'rgba(59, 130, 246, 0.3)'
          }`,
          animation: 'float 3s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
          },
        }}>
          {React.cloneElement(icon, { 
            fontSize: 'large', 
            sx: { color: 'white' }
          })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { darkMode } = useTheme();
  const [dashboardData, setDashboardData] = useState(null);
  const [workoutAnalytics, setWorkoutAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, analyticsRes] = await Promise.all([
          axios.get('/api/analytics/dashboard'),
          axios.get('/api/analytics/workouts?period=30')
        ]);
        
        setDashboardData(dashboardRes.data);
        setWorkoutAnalytics(analyticsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  // Use daily trend for better recent data visualization
  const trendData = workoutAnalytics?.dailyTrend || workoutAnalytics?.weeklyTrend || [];
  
  const chartData = {
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
        label: 'Calories Burned',
        data: trendData.map(item => item.calories) || [],
        borderColor: '#dc004e',
        backgroundColor: 'rgba(220, 0, 78, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#dc004e',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        tension: 0.4,
        fill: true,
        yAxisID: 'y1'
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
            size: 14,
            weight: 'bold'
          },
          color: darkMode ? '#ffffff' : '#2C3E50'
        }
      },
      title: {
        display: true,
        text: 'Weekly Workout Trends',
        font: {
          size: 18,
          weight: 'bold'
        },
        padding: 20,
        color: darkMode ? '#ffffff' : '#2C3E50'
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            weight: 'bold',
            size: 12
          },
          color: darkMode ? '#ffffff' : '#2C3E50'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Number of Workouts',
          font: {
            weight: 'bold',
            size: 14
          },
          color: darkMode ? '#ffffff' : '#2C3E50'
        },
        grid: {
          color: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
        },
        ticks: {
          color: darkMode ? '#ffffff' : '#2C3E50',
          font: {
            weight: 'bold'
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Calories Burned',
          font: {
            weight: 'bold',
            size: 14
          },
          color: darkMode ? '#ffffff' : '#2C3E50'
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: darkMode ? '#ffffff' : '#2C3E50',
          font: {
            weight: 'bold'
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        background: darkMode 
          ? 'rgba(255, 255, 255, 0.1)'
          : 'linear-gradient(135deg, #2ECC71 0%, #3498DB 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: 4,
        p: 4,
        mb: 4,
        color: 'white',
        textAlign: 'center',
        border: darkMode 
          ? '1px solid rgba(255, 255, 255, 0.2)'
          : '1px solid rgba(46, 204, 113, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: darkMode 
          ? '0 8px 32px rgba(0, 0, 0, 0.3)'
          : '0 8px 32px rgba(46, 204, 113, 0.2)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: darkMode 
            ? 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), transparent)'
            : 'linear-gradient(45deg, rgba(255, 255, 255, 0.2), transparent)',
          animation: 'shimmer 3s ease-in-out infinite',
        },
        '@keyframes shimmer': {
          '0%, 100%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' },
        },
      }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 800,
              color: 'white',
              mb: 2,
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
            }}
          >
            🏋️ Fitness Dashboard
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.95)',
              fontWeight: 500,
              letterSpacing: '0.5px',
              textShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}
          >
            Track your progress, achieve your goals ✨
          </Typography>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Workouts"
            value={dashboardData?.today?.workouts || 0}
            subtitle="sessions completed"
            icon={<FitnessCenter />}
            color="primary"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Calories Burned Today"
            value={dashboardData?.today?.calories || 0}
            subtitle="kcal burned"
            icon={<LocalFireDepartment />}
            color="secondary"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="This Week's Workouts"
            value={dashboardData?.thisWeek?.workouts || 0}
            subtitle="weekly progress"
            icon={<TrendingUp />}
            color="success"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Current Weight"
            value={dashboardData?.latestMetrics?.weight ? `${dashboardData.latestMetrics.weight}` : 'N/A'}
            subtitle={dashboardData?.latestMetrics?.weight ? 'kg' : 'not recorded'}
            icon={<MonitorWeight />}
            color="info"
          />
        </Grid>

        {/* Chart */}
        <Grid item xs={12}>
          <Paper sx={{ 
            p: 4, 
            background: darkMode 
              ? 'rgba(44, 83, 100, 0.9)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: darkMode 
              ? '1px solid rgba(255, 255, 255, 0.2)'
              : '1px solid rgba(46, 204, 113, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: darkMode 
              ? '0 8px 32px rgba(0, 0, 0, 0.4)'
              : '0 8px 32px rgba(46, 204, 113, 0.1)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: darkMode 
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))'
                : 'linear-gradient(135deg, rgba(46, 204, 113, 0.05), rgba(52, 152, 219, 0.05))',
              zIndex: 0,
            },
          }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  color: darkMode ? '#ffffff' : '#2C3E50',
                  mb: 3,
                  textAlign: 'center',
                  textShadow: darkMode 
                    ? '0 2px 4px rgba(0,0,0,0.3)'
                    : '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                📈 Workout Trends (Last 30 Days)
              </Typography>
              {trendData?.length > 0 ? (
                <Box sx={{ 
                  height: 400, 
                  mt: 2,
                  background: darkMode 
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(255, 255, 255, 0.8)',
                  borderRadius: 3,
                  p: 3,
                  border: darkMode 
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(46, 204, 113, 0.1)',
                }}>
                  <Line data={chartData} options={chartOptions} />
                </Box>
              ) : (
                <Box textAlign="center" py={8}>
                  <FitnessCenter sx={{ 
                    fontSize: 80, 
                    color: 'rgba(255, 255, 255, 0.6)', 
                    mb: 3,
                    animation: 'bounce 2s ease-in-out infinite',
                    '@keyframes bounce': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-20px)' },
                    },
                  }} />
                  <Typography variant="h5" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                    No workout data available yet
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
                    Start logging your workouts to see beautiful trends and insights! ✨
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 4, 
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            color: 'white',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))',
              zIndex: 0,
            },
          }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, textAlign: 'center', mb: 3 }}>
                📊 30-Day Summary
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box textAlign="center" sx={{ 
                    p: 3, 
                    background: 'rgba(255,255,255,0.1)', 
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      background: 'rgba(255,255,255,0.2)',
                    },
                  }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                      {workoutAnalytics?.summary?.totalWorkouts || 0}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>Total Workouts</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" sx={{ 
                    p: 3, 
                    background: 'rgba(255,255,255,0.1)', 
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      background: 'rgba(255,255,255,0.2)',
                    },
                  }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                      {workoutAnalytics?.summary?.totalCalories || 0}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>Total Calories</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" sx={{ 
                    p: 3, 
                    background: 'rgba(255,255,255,0.1)', 
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      background: 'rgba(255,255,255,0.2)',
                    },
                  }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                      {Math.round((workoutAnalytics?.summary?.totalDuration || 0) / 60)}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>Hours Exercised</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" sx={{ 
                    p: 3, 
                    background: 'rgba(255,255,255,0.1)', 
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      background: 'rgba(255,255,255,0.2)',
                    },
                  }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                      {Math.round(workoutAnalytics?.summary?.avgCaloriesPerWorkout || 0)}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>Avg Cal/Workout</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 4,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(244, 114, 182, 0.2))',
              zIndex: 0,
            },
          }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, textAlign: 'center', mb: 3, color: 'white' }}>
                🏥 Latest Health Metrics
              </Typography>
              <Grid container spacing={2}>
                {dashboardData?.latestMetrics?.weight && (
                  <Grid item xs={6}>
                    <Box textAlign="center" sx={{ 
                      p: 3, 
                      background: 'rgba(255,255,255,0.1)', 
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      border: '1px solid rgba(255,255,255,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        background: 'rgba(255,255,255,0.2)',
                      },
                    }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
                        {dashboardData.latestMetrics.weight}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Weight (kg)</Typography>
                    </Box>
                  </Grid>
                )}
                {dashboardData?.latestMetrics?.sleepHours && (
                  <Grid item xs={6}>
                    <Box textAlign="center" sx={{ 
                      p: 3, 
                      background: 'rgba(255,255,255,0.1)', 
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      border: '1px solid rgba(255,255,255,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        background: 'rgba(255,255,255,0.2)',
                      },
                    }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
                        {Math.round(dashboardData.latestMetrics.sleepHours * 10) / 10}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Sleep (hours)</Typography>
                    </Box>
                  </Grid>
                )}
                {dashboardData?.latestMetrics?.stepsCount && (
                  <Grid item xs={12}>
                    <Box textAlign="center" sx={{ 
                      p: 3, 
                      background: 'rgba(255,255,255,0.1)', 
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      border: '1px solid rgba(255,255,255,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        background: 'rgba(255,255,255,0.2)',
                      },
                    }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
                        {dashboardData.latestMetrics.stepsCount.toLocaleString()}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Daily Steps</Typography>
                    </Box>
                  </Grid>
                )}
                {!dashboardData?.latestMetrics?.weight && 
                 !dashboardData?.latestMetrics?.sleepHours && 
                 !dashboardData?.latestMetrics?.stepsCount && (
                  <Grid item xs={12}>
                    <Box textAlign="center" py={6}>
                      <MonitorWeight sx={{ 
                        fontSize: 64, 
                        color: 'rgba(255,255,255,0.6)', 
                        mb: 2,
                        animation: 'pulse 2s ease-in-out infinite',
                      }} />
                      <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
                        No health metrics recorded yet. Visit your profile to add some! 📊
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;