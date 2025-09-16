const express = require('express');
const mongoose = require('mongoose');
const HealthMetric = require('../models/HealthMetric');
const auth = require('../middleware/auth');

const router = express.Router();

// Get health metrics
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate, limit = 30 } = req.query;
    
    let query = { userId: new mongoose.Types.ObjectId(req.userId) };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const metrics = await HealthMetric.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create or update health metric
router.post('/', auth, async (req, res) => {
  try {
    const { date, ...metricData } = req.body;
    const metricDate = date ? new Date(date) : new Date();
    
    // Set to start of day for consistency
    metricDate.setHours(0, 0, 0, 0);

    const metric = await HealthMetric.findOneAndUpdate(
      { 
        userId: new mongoose.Types.ObjectId(req.userId), 
        date: metricDate 
      },
      { 
        ...metricData,
        userId: new mongoose.Types.ObjectId(req.userId),
        date: metricDate
      },
      { 
        new: true, 
        upsert: true 
      }
    );

    res.json(metric);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get latest metrics
router.get('/latest', auth, async (req, res) => {
  try {
    const latestMetric = await HealthMetric.findOne({ userId: new mongoose.Types.ObjectId(req.userId) })
      .sort({ date: -1 });

    res.json(latestMetric || {});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;