const express = require('express');
const mongoose = require('mongoose');
const Workout = require('../models/Workout');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all workouts for user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    
    let query = { userId: new mongoose.Types.ObjectId(req.userId) };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const workouts = await Workout.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Workout.countDocuments(query);

    res.json({
      workouts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create workout
router.post('/', auth, async (req, res) => {
  try {
    console.log('=== CREATING WORKOUT ===');
    console.log('User ID from token:', req.userId);
    console.log('User ID type:', typeof req.userId);
    
    const userObjectId = new mongoose.Types.ObjectId(req.userId);
    console.log('Converted to ObjectId:', userObjectId);
    
    const workout = new Workout({
      ...req.body,
      userId: userObjectId
    });

    console.log('Workout before save:', {
      userId: workout.userId,
      userIdType: typeof workout.userId,
      title: workout.title
    });

    await workout.save();
    console.log('Workout saved successfully');
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get workout by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      userId: new mongoose.Types.ObjectId(req.userId)
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update workout
router.put('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: new mongoose.Types.ObjectId(req.userId) },
      req.body,
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete workout
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      userId: new mongoose.Types.ObjectId(req.userId)
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;