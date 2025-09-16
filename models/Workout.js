const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['cardio', 'strength', 'flexibility', 'sports', 'other'],
    required: true
  },
  duration: Number, // in minutes
  sets: Number,
  reps: Number,
  weight: Number, // in kg
  distance: Number, // in km
  caloriesBurned: Number,
  notes: String
});

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  title: {
    type: String,
    required: true
  },
  exercises: [exerciseSchema],
  totalDuration: {
    type: Number,
    required: true
  }, // in minutes
  totalCaloriesBurned: {
    type: Number,
    required: true
  },
  mood: {
    type: String,
    enum: ['excellent', 'good', 'average', 'poor', 'terrible']
  },
  intensity: {
    type: String,
    enum: ['low', 'moderate', 'high', 'extreme'],
    default: 'moderate'
  },
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Workout', workoutSchema);