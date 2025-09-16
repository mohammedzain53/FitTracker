const express = require('express');
const mongoose = require('mongoose');
const Workout = require('../models/Workout');
const HealthMetric = require('../models/HealthMetric');
const auth = require('../middleware/auth');

const router = express.Router();

// Get workout analytics
router.get('/workouts', auth, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    console.log('=== ANALYTICS DEBUG ===');
    console.log('User ID from token:', req.userId);
    console.log('Period:', period, 'days');
    console.log('Start date:', startDate);

    // Convert userId to ObjectId for proper matching
    const userObjectId = new mongoose.Types.ObjectId(req.userId);
    console.log('User ObjectId:', userObjectId);
    
    // First, let's check ALL workouts in the database
    const allWorkouts = await Workout.find({});
    console.log('Total workouts in database:', allWorkouts.length);
    
    // Check workouts for this user (without date filter)
    const allUserWorkouts = await Workout.find({ userId: userObjectId });
    console.log('User workouts found:', allUserWorkouts.length);
    
    if (allWorkouts.length > 0 && allUserWorkouts.length === 0) {
      console.log('Sample workout from DB:', {
        id: allWorkouts[0]._id,
        userId: allWorkouts[0].userId,
        userIdType: typeof allWorkouts[0].userId,
        title: allWorkouts[0].title,
        date: allWorkouts[0].date
      });
      console.log('Comparing:', {
        tokenUserId: req.userId,
        tokenUserIdType: typeof req.userId,
        objectId: userObjectId.toString(),
        match: allWorkouts[0].userId.toString() === req.userId
      });
    }
    
    if (allUserWorkouts.length > 0) {
      console.log('Sample user workout:', {
        id: allUserWorkouts[0]._id,
        date: allUserWorkouts[0].date,
        userId: allUserWorkouts[0].userId,
        title: allUserWorkouts[0].title
      });
    }
    
    // Check workouts with date filter
    const totalWorkouts = await Workout.countDocuments({
      userId: userObjectId,
      date: { $gte: startDate }
    });
    console.log('Total workouts found with date filter:', totalWorkouts);

    // Total workouts and calories
    const totalStats = await Workout.aggregate([
      {
        $match: {
          userId: userObjectId,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          totalCalories: { $sum: '$totalCaloriesBurned' },
          totalDuration: { $sum: '$totalDuration' },
          avgCaloriesPerWorkout: { $avg: '$totalCaloriesBurned' },
          avgDuration: { $avg: '$totalDuration' }
        }
      }
    ]);

    // Workouts by category
    const categoryStats = await Workout.aggregate([
      {
        $match: {
          userId: userObjectId,
          date: { $gte: startDate }
        }
      },
      { $unwind: '$exercises' },
      {
        $group: {
          _id: '$exercises.category',
          count: { $sum: 1 },
          totalCalories: { $sum: '$exercises.caloriesBurned' }
        }
      }
    ]);

    // Daily trend (better for recent data)
    const dailyTrend = await Workout.aggregate([
      {
        $match: {
          userId: userObjectId,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$date' },
            month: { $month: '$date' },
            year: { $year: '$date' },
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }
          },
          workouts: { $sum: 1 },
          calories: { $sum: '$totalCaloriesBurned' },
          duration: { $sum: '$totalDuration' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Weekly trend for longer periods
    const weeklyTrend = await Workout.aggregate([
      {
        $match: {
          userId: userObjectId,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            week: { $week: '$date' },
            year: { $year: '$date' }
          },
          workouts: { $sum: 1 },
          calories: { $sum: '$totalCaloriesBurned' },
          duration: { $sum: '$totalDuration' }
        }
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } }
    ]);

    console.log('Analytics results:', {
      totalStats: totalStats[0],
      categoryCount: categoryStats.length,
      dailyTrendCount: dailyTrend.length,
      weeklyTrendCount: weeklyTrend.length
    });

    res.json({
      summary: totalStats[0] || {
        totalWorkouts: 0,
        totalCalories: 0,
        totalDuration: 0,
        avgCaloriesPerWorkout: 0,
        avgDuration: 0
      },
      categoryBreakdown: categoryStats,
      weeklyTrend,
      dailyTrend: days <= 30 ? dailyTrend : weeklyTrend // Use daily for short periods
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get health metrics analytics
router.get('/health', auth, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const userObjectId = new mongoose.Types.ObjectId(req.userId);
    
    const healthTrend = await HealthMetric.find({
      userId: userObjectId,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    // Calculate trends
    const weightTrend = healthTrend
      .filter(m => m.weight)
      .map(m => ({ date: m.date, value: m.weight }));

    const sleepTrend = healthTrend
      .filter(m => m.sleepHours)
      .map(m => ({ date: m.date, value: m.sleepHours }));

    const stepsTrend = healthTrend
      .filter(m => m.stepsCount)
      .map(m => ({ date: m.date, value: m.stepsCount }));

    res.json({
      weightTrend,
      sleepTrend,
      stepsTrend,
      totalRecords: healthTrend.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get dashboard summary
router.get('/dashboard', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);

    // Convert userId to ObjectId for dashboard queries too
    const userObjectId = new mongoose.Types.ObjectId(req.userId);
    
    // Today's stats
    const todayWorkouts = await Workout.countDocuments({
      userId: userObjectId,
      date: { 
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Next day
      }
    });

    const todayCalories = await Workout.aggregate([
      {
        $match: {
          userId: userObjectId,
          date: { 
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: null,
          totalCalories: { $sum: '$totalCaloriesBurned' }
        }
      }
    ]);

    // This week's stats
    const weekWorkouts = await Workout.countDocuments({
      userId: userObjectId,
      date: { $gte: thisWeek }
    });

    // Latest health metrics
    const latestMetrics = await HealthMetric.findOne({
      userId: userObjectId
    }).sort({ date: -1 });

    res.json({
      today: {
        workouts: todayWorkouts,
        calories: todayCalories[0]?.totalCalories || 0
      },
      thisWeek: {
        workouts: weekWorkouts
      },
      latestMetrics: latestMetrics || {}
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;