import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tooltip, Grid } from '@mui/material';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const WorkoutHeatmap = () => {
  const { darkMode } = useTheme();
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeatmapData();
  }, []);

  const fetchHeatmapData = async () => {
    try {
      // Get data for the last year
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);

      const response = await axios.get(`/api/workouts?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&limit=1000`);
      
      // Process workout data into daily intensity scores
      const workoutsByDate = {};
      response.data.workouts.forEach(workout => {
        const date = new Date(workout.date).toDateString();
        if (!workoutsByDate[date]) {
          workoutsByDate[date] = {
            workouts: [],
            totalIntensity: 0,
            maxIntensity: 0
          };
        }
        
        // Convert intensity to numeric score
        const intensityScore = getIntensityScore(workout.intensity);
        workoutsByDate[date].workouts.push({
          title: workout.title,
          intensity: workout.intensity,
          intensityScore: intensityScore,
          duration: workout.totalDuration,
          calories: workout.totalCaloriesBurned
        });
        workoutsByDate[date].totalIntensity += intensityScore;
        workoutsByDate[date].maxIntensity = Math.max(workoutsByDate[date].maxIntensity, intensityScore);
      });

      // Generate heatmap data for the last year
      const heatmapArray = [];
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const dateStr = currentDate.toDateString();
        const dayData = workoutsByDate[dateStr];
        
        let intensityLevel = 0;
        let workoutCount = 0;
        let avgIntensity = 0;
        let totalCalories = 0;
        let totalDuration = 0;
        
        if (dayData) {
          workoutCount = dayData.workouts.length;
          totalCalories = dayData.workouts.reduce((sum, w) => sum + (w.calories || 0), 0);
          totalDuration = dayData.workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
          avgIntensity = dayData.totalIntensity / workoutCount;
          
          // Calculate intensity level based on both workout count and intensity
          intensityLevel = getIntensityLevel(workoutCount, avgIntensity, dayData.maxIntensity);
        }
        
        heatmapArray.push({
          date: new Date(currentDate),
          count: workoutCount,
          intensityLevel: intensityLevel,
          avgIntensity: avgIntensity,
          totalCalories: totalCalories,
          totalDuration: totalDuration,
          workouts: dayData ? dayData.workouts : [],
          level: intensityLevel // Keep for compatibility
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setHeatmapData(heatmapArray);
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Convert intensity string to numeric score
  const getIntensityScore = (intensity) => {
    const intensityMap = {
      'low': 1,
      'moderate': 2,
      'high': 3,
      'extreme': 4
    };
    return intensityMap[intensity] || 2; // default to moderate
  };

  // Calculate intensity level for heatmap display
  const getIntensityLevel = (workoutCount, avgIntensity, maxIntensity) => {
    if (workoutCount === 0) return 0; // No workouts
    
    // Single workout - base on intensity
    if (workoutCount === 1) {
      if (avgIntensity >= 4) return 4; // Extreme
      if (avgIntensity >= 3) return 3; // High
      if (avgIntensity >= 2) return 2; // Moderate
      return 1; // Low
    }
    
    // Multiple workouts - consider both count and intensity
    const intensityFactor = avgIntensity / 4; // Normalize to 0-1
    const countFactor = Math.min(workoutCount / 3, 1); // Cap at 3 workouts for count factor
    const combinedScore = (intensityFactor * 0.7) + (countFactor * 0.3); // Weight intensity more
    
    if (combinedScore >= 0.9 || maxIntensity >= 4) return 4; // Extreme day
    if (combinedScore >= 0.7 || maxIntensity >= 3) return 3; // High intensity day
    if (combinedScore >= 0.5 || avgIntensity >= 2.5) return 2; // Moderate day
    return 1; // Light day
  };

  const getColor = (level) => {
    if (darkMode) {
      const colors = [
        'rgba(44, 83, 100, 0.2)',   // No workouts - dark blue
        'rgba(46, 204, 113, 0.5)',  // Low intensity - green
        'rgba(255, 193, 7, 0.7)',   // Moderate intensity - yellow
        'rgba(255, 87, 34, 0.85)',  // High intensity - orange
        'rgba(255, 20, 147, 0.95)'  // Extreme intensity - hot pink (more distinct!)
      ];
      return colors[level];
    } else {
      const colors = [
        'rgba(226, 232, 240, 0.5)', // No workouts - light gray
        'rgba(76, 175, 80, 0.4)',   // Low intensity - light green
        'rgba(255, 193, 7, 0.6)',   // Moderate intensity - yellow
        'rgba(255, 152, 0, 0.8)',   // High intensity - orange
        'rgba(244, 67, 54, 0.9)'    // Extreme intensity - red
      ];
      return colors[level];
    }
  };

  const getBorderColor = (level) => {
    if (darkMode) {
      const colors = [
        'rgba(192, 192, 192, 0.3)', // No workouts
        'rgba(46, 204, 113, 0.8)',  // Low intensity
        'rgba(255, 193, 7, 0.9)',   // Moderate intensity
        'rgba(255, 87, 34, 1)',     // High intensity
        'rgba(255, 20, 147, 1)'     // Extreme intensity - hot pink border
      ];
      return colors[level];
    } else {
      const colors = [
        'rgba(203, 213, 225, 0.6)', // No workouts
        'rgba(76, 175, 80, 0.7)',   // Low intensity
        'rgba(255, 193, 7, 0.8)',   // Moderate intensity
        'rgba(255, 152, 0, 0.9)',   // High intensity
        'rgba(244, 67, 54, 1)'      // Extreme intensity
      ];
      return colors[level];
    }
  };

  const getGlowColor = (level) => {
    if (darkMode) {
      const colors = [
        'transparent',               // No workouts
        'rgba(46, 204, 113, 0.5)',  // Low intensity
        'rgba(255, 193, 7, 0.6)',   // Moderate intensity
        'rgba(255, 87, 34, 0.7)',   // High intensity
        'rgba(255, 20, 147, 0.8)'   // Extreme intensity - hot pink glow
      ];
      return colors[level];
    } else {
      const colors = [
        'transparent',               // No workouts
        'rgba(76, 175, 80, 0.3)',   // Low intensity
        'rgba(255, 193, 7, 0.4)',   // Moderate intensity
        'rgba(255, 152, 0, 0.5)',   // High intensity
        'rgba(244, 67, 54, 0.6)'    // Extreme intensity
      ];
      return colors[level];
    }
  };

  const getIntensityColor = (intensity) => {
    const colors = {
      'low': '#4CAF50',
      'moderate': '#FFC107', 
      'high': '#FF9800',
      'extreme': '#F44336'
    };
    return colors[intensity] || '#FFC107';
  };

  const groupByWeeks = (data) => {
    const weeks = [];
    let currentWeek = new Array(7).fill(null); // Initialize with 7 slots for each day
    
    data.forEach((day, index) => {
      const dayOfWeek = day.date.getDay(); // 0 = Sunday, 6 = Saturday
      
      // If we're starting a new week (Sunday) and current week has data
      if (dayOfWeek === 0 && currentWeek.some(d => d !== null)) {
        weeks.push([...currentWeek]);
        currentWeek = new Array(7).fill(null);
      }
      
      // Place the day in the correct position
      currentWeek[dayOfWeek] = day;
      
      // Push the last week
      if (index === data.length - 1) {
        weeks.push(currentWeek);
      }
    });
    
    return weeks.filter(week => week.some(d => d !== null)); // Remove empty weeks
  };

  const getMonthLabels = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push({
        label: date.toLocaleDateString('en-US', { month: 'short' }),
        date: new Date(date)
      });
    }
    
    return months;
  };

  const getMonthPositions = (weeks, monthLabels) => {
    const positions = [];
    
    monthLabels.forEach((month) => {
      // Find the first week that contains the first day of this month
      for (let weekIndex = 0; weekIndex < weeks.length; weekIndex++) {
        const week = weeks[weekIndex];
        const hasMonthStart = week.some(day => 
          day && 
          day.date.getMonth() === month.date.getMonth() && 
          day.date.getFullYear() === month.date.getFullYear()
        );
        
        if (hasMonthStart) {
          // Find the first day of this month in this week
          const firstDayIndex = week.findIndex(day => 
            day && 
            day.date.getMonth() === month.date.getMonth() && 
            day.date.getFullYear() === month.date.getFullYear()
          );
          
          // Calculate position: week position + day offset within week
          const weekPosition = weekIndex * (18 + 2.4); // week spacing
          const dayOffset = firstDayIndex >= 0 ? 0 : 0; // start at beginning of week
          
          positions.push({
            label: month.label,
            weekIndex: weekIndex,
            left: weekPosition + dayOffset
          });
          break;
        }
      }
    });
    
    return positions;
  };

  const totalWorkouts = heatmapData.reduce((sum, day) => sum + day.count, 0);
  const weeks = groupByWeeks(heatmapData);
  const monthLabels = getMonthLabels();
  const monthPositions = getMonthPositions(weeks, monthLabels);
  
  // Calculate intensity-based statistics
  const activeDays = heatmapData.filter(day => day.count > 0).length;
  const highIntensityDays = heatmapData.filter(day => day.intensityLevel >= 3).length;
  const averageIntensity = activeDays > 0 ? 
    (heatmapData.reduce((sum, day) => sum + (day.avgIntensity || 0), 0) / activeDays).toFixed(1) : 0;
  const currentStreak = getCurrentStreak(heatmapData);
  const longestStreak = getLongestStreak(heatmapData);
  const totalCalories = heatmapData.reduce((sum, day) => sum + (day.totalCalories || 0), 0);
  
  function getCurrentStreak(data) {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = data.length - 1; i >= 0; i--) {
      const dayDate = new Date(data[i].date);
      dayDate.setHours(0, 0, 0, 0);
      
      if (dayDate.getTime() === today.getTime() - (streak * 24 * 60 * 60 * 1000)) {
        if (data[i].count > 0) {
          streak++;
        } else {
          break;
        }
      }
    }
    return streak;
  }
  
  function getLongestStreak(data) {
    let maxStreak = 0;
    let currentStreak = 0;
    
    data.forEach(day => {
      if (day.count > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return maxStreak;
  }

  if (loading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography>Loading workout heatmap...</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ 
      p: 5, 
      borderRadius: 4,
      background: darkMode 
        ? 'linear-gradient(145deg, rgba(44, 83, 100, 0.95), rgba(32, 58, 67, 0.9))'
        : 'linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95))',
      backdropFilter: 'blur(25px)',
      border: darkMode 
        ? '2px solid rgba(255, 23, 68, 0.2)'
        : '2px solid rgba(46, 204, 113, 0.3)',
      boxShadow: darkMode 
        ? '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 23, 68, 0.1)'
        : '0 20px 60px rgba(46, 204, 113, 0.2), 0 0 40px rgba(52, 152, 219, 0.1)',
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
          ? 'radial-gradient(circle at 20% 20%, rgba(255, 23, 68, 0.1), transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 214, 0, 0.1), transparent 50%)'
          : 'radial-gradient(circle at 20% 20%, rgba(46, 204, 113, 0.08), transparent 50%), radial-gradient(circle at 80% 80%, rgba(52, 152, 219, 0.08), transparent 50%)',
        animation: 'pulse 4s ease-in-out infinite',
        zIndex: 0,
      },
      '@keyframes pulse': {
        '0%, 100%': { opacity: 0.5 },
        '50%': { opacity: 0.8 },
      },
    }}>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 800,
              background: darkMode 
                ? 'linear-gradient(135deg, #FF1744 0%, #FFD600 100%)'
                : 'linear-gradient(135deg, #2ECC71 0%, #3498DB 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              textShadow: darkMode 
                ? '0 2px 8px rgba(255, 23, 68, 0.3)'
                : '0 2px 8px rgba(46, 204, 113, 0.2)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}
          >
            🔥 {totalWorkouts} workouts • {totalCalories.toLocaleString()} calories burned
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(44, 62, 80, 0.8)',
              fontWeight: 500,
              letterSpacing: '0.5px',
              mb: 3,
            }}
          >
            Your workout intensity & consistency journey ✨
          </Typography>
          
          {/* GitHub-style Stats */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 4, 
            flexWrap: 'wrap',
            mb: 2
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700,
                color: darkMode ? '#FF1744' : '#2ECC71',
                mb: 0.5
              }}>
                {activeDays}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(44, 62, 80, 0.7)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: 600
              }}>
                Active Days
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700,
                color: darkMode ? '#FFD600' : '#3498DB',
                mb: 0.5
              }}>
                {currentStreak}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(44, 62, 80, 0.7)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: 600
              }}>
                Current Streak
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700,
                color: darkMode ? '#FF1744' : '#2ECC71',
                mb: 0.5
              }}>
                {longestStreak}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(44, 62, 80, 0.7)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: 600
              }}>
                Longest Streak
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700,
                color: darkMode ? '#FFD600' : '#3498DB',
                mb: 0.5
              }}>
                {averageIntensity}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(44, 62, 80, 0.7)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: 600
              }}>
                Avg Intensity
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700,
                color: darkMode ? '#FF5722' : '#E91E63',
                mb: 0.5
              }}>
                {highIntensityDays}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(44, 62, 80, 0.7)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: 600
              }}>
                High Intensity Days
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Heatmap Container */}
      <Box sx={{ 
        overflowX: 'auto',
        pb: 2,
        '&::-webkit-scrollbar': {
          height: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
          borderRadius: '3px',
        },
      }}>
        {/* Month Labels */}
        <Box sx={{ 
          position: 'relative',
          mb: 2, 
          ml: '60px', // Account for day labels width
          height: '20px',
          minWidth: `${weeks.length * (18 + 2.4)}px`, // Ensure full width
          background: darkMode 
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(46, 204, 113, 0.05)',
          borderRadius: 2,
          border: darkMode 
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(46, 204, 113, 0.1)',
        }}>
          {monthPositions.map((month, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{
                position: 'absolute',
                left: `${month.left}px`,
                top: '50%',
                transform: 'translateY(-50%)',
                color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(44, 62, 80, 0.8)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap',
                zIndex: 10,
              }}
            >
              {month.label}
            </Typography>
          ))}
        </Box>

        {/* Heatmap Grid */}
        <Box sx={{ 
          display: 'flex', 
          gap: 0.3,
          minWidth: `${60 + weeks.length * (18 + 2.4)}px` // Day labels + grid width
        }}>
          {/* Day Labels */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            mr: 2, 
            justifyContent: 'space-around', 
            height: '154px', // 7 cells * 18px + 6 gaps * 2.4px
            width: '50px',
            p: 1,
            background: darkMode 
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(46, 204, 113, 0.05)',
            borderRadius: 2,
            border: darkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(46, 204, 113, 0.1)',
          }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <Typography
                key={day}
                variant="body2"
                sx={{
                  color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(44, 62, 80, 0.8)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {index % 2 === 1 ? day : ''}
              </Typography>
            ))}
          </Box>

          {/* Heatmap Cells */}
          <Box sx={{ 
            display: 'flex', 
            gap: '2.4px', 
            flexWrap: 'nowrap'
          }}>
          {weeks.map((week, weekIndex) => (
            <Box key={weekIndex} sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '2.4px',
              minWidth: '18px'
            }}>
              {week.map((dayData, dayIndex) => {
                if (!dayData) {
                  return (
                    <Box
                      key={dayIndex}
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: 1,
                        backgroundColor: 'transparent'
                      }}
                    />
                  );
                }

                return (
                  <Tooltip
                    key={dayIndex}
                    title={
                      <Box sx={{ p: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {dayData.date.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </Typography>
                        {dayData.count === 0 ? (
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                            No workouts
                          </Typography>
                        ) : (
                          <>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1 }}>
                              {dayData.count} workout{dayData.count !== 1 ? 's' : ''}
                            </Typography>
                            {dayData.workouts.map((workout, idx) => (
                              <Box key={idx} sx={{ mb: 0.5 }}>
                                <Typography variant="caption" sx={{ 
                                  color: 'rgba(255,255,255,0.8)',
                                  fontWeight: 600,
                                  display: 'block'
                                }}>
                                  {workout.title}
                                </Typography>
                                <Typography variant="caption" sx={{ 
                                  color: getIntensityColor(workout.intensity),
                                  textTransform: 'capitalize',
                                  fontWeight: 500
                                }}>
                                  {workout.intensity} intensity
                                  {workout.duration && ` • ${workout.duration}min`}
                                  {workout.calories && ` • ${workout.calories}cal`}
                                </Typography>
                              </Box>
                            ))}
                            <Typography variant="caption" sx={{ 
                              color: 'rgba(255,255,255,0.7)',
                              fontStyle: 'italic',
                              mt: 0.5,
                              display: 'block'
                            }}>
                              {dayData.intensityLevel >= 4 
                                ? '🔥 Extreme intensity!' 
                                : dayData.intensityLevel >= 3 
                                  ? '💪 High intensity!' 
                                  : dayData.intensityLevel >= 2
                                    ? '⚡ Good intensity!'
                                    : '✨ Light workout!'
                              }
                            </Typography>
                          </>
                        )}
                      </Box>
                    }
                    arrow
                    placement="top"
                    componentsProps={{
                      tooltip: {
                        sx: {
                          bgcolor: darkMode ? 'rgba(44, 83, 100, 0.95)' : 'rgba(44, 62, 80, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: darkMode 
                            ? '1px solid rgba(255, 23, 68, 0.3)'
                            : '1px solid rgba(46, 204, 113, 0.3)',
                          borderRadius: 2,
                          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        }
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: 1,
                        backgroundColor: getColor(dayData.level),
                        border: `1.5px solid ${getBorderColor(dayData.level)}`,
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'scale(1.15) rotate(2deg)',
                          boxShadow: `0 0 20px ${getGlowColor(dayData.level)}`,
                          zIndex: 10,
                        },
                        // Center dot for high activity days
                        '&::after': dayData.level >= 3 ? {
                          content: '""',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          backgroundColor: darkMode ? '#FFD600' : '#3498DB',
                          boxShadow: `0 0 6px ${darkMode ? '#FFD600' : '#3498DB'}`,
                          animation: 'glow 2s ease-in-out infinite alternate',
                        } : {},
                        '@keyframes glow': {
                          '0%': { opacity: 0.7 },
                          '100%': { opacity: 1 },
                        },
                      }}
                    />
                  </Tooltip>
                );
              })}
            </Box>
          ))}
          </Box>
        </Box>
      </Box>

      {/* Enhanced Legend */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        mt: 4, 
        gap: 2,
        p: 3,
        background: darkMode 
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(46, 204, 113, 0.05)',
        borderRadius: 3,
        border: darkMode 
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(46, 204, 113, 0.1)',
        backdropFilter: 'blur(10px)',
      }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(44, 62, 80, 0.8)',
            fontWeight: 600,
            mr: 2
          }}
        >
          Less
        </Typography>
        {[0, 1, 2, 3, 4].map((level) => (
          <Tooltip
            key={level}
            title={
              level === 0 ? 'No workouts' :
              level === 1 ? 'Low intensity' :
              level === 2 ? 'Moderate intensity' :
              level === 3 ? 'High intensity' :
              'Extreme intensity'
            }
            arrow
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: 1,
                backgroundColor: getColor(level),
                border: `1.5px solid ${getBorderColor(level)}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                '&:hover': {
                  transform: 'scale(1.2)',
                  boxShadow: `0 0 12px ${getGlowColor(level)}`,
                },
                // Center dot for high activity levels
                '&::after': level >= 3 ? {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  backgroundColor: darkMode ? '#FFD600' : '#3498DB',
                  boxShadow: `0 0 4px ${darkMode ? '#FFD600' : '#3498DB'}`,
                } : {},
              }}
            />
          </Tooltip>
        ))}
        <Typography 
          variant="body2" 
          sx={{ 
            color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(44, 62, 80, 0.8)',
            fontWeight: 600,
            ml: 2
          }}
        >
          More
        </Typography>
      </Box>
      
      {/* GitHub-style Summary */}
      <Box sx={{ 
        mt: 4, 
        p: 3,
        background: darkMode 
          ? 'rgba(255, 255, 255, 0.03)'
          : 'rgba(46, 204, 113, 0.03)',
        borderRadius: 3,
        border: darkMode 
          ? '1px solid rgba(255, 255, 255, 0.08)'
          : '1px solid rgba(46, 204, 113, 0.08)',
        textAlign: 'center'
      }}>
        <Typography variant="body2" sx={{ 
          color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(44, 62, 80, 0.7)',
          lineHeight: 1.6,
          fontWeight: 500
        }}>
          {totalWorkouts > 0 ? (
            <>
              You've completed <strong>{totalWorkouts}</strong> workouts over the past year, 
              staying active for <strong>{activeDays}</strong> days with an average intensity of <strong>{averageIntensity}</strong>. 
              {highIntensityDays > 0 && (
                <> You pushed yourself with <strong>{highIntensityDays}</strong> high-intensity sessions! 🔥</>
              )}
              {currentStreak > 0 && (
                <> You're currently on a <strong>{currentStreak}-day streak</strong> - keep it up! 🚀</>
              )}
              {longestStreak > 7 && (
                <> Your longest streak was <strong>{longestStreak} days</strong> - impressive dedication! 💪</>
              )}
            </>
          ) : (
            <>
              Ready to start your fitness journey? Your first workout will be the beginning of something amazing! 🌟
            </>
          )}
        </Typography>
      </Box>
    </Paper>
  );
};

export default WorkoutHeatmap;