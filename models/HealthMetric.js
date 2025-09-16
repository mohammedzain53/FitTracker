const mongoose = require('mongoose');

const healthMetricSchema = new mongoose.Schema({
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
  weight: Number, // in kg
  bodyFatPercentage: Number,
  muscleMass: Number, // in kg
  restingHeartRate: Number, // bpm
  bloodPressure: {
    systolic: Number,
    diastolic: Number
  },
  sleepHours: Number,
  waterIntake: Number, // in liters
  stepsCount: Number,
  notes: String
}, {
  timestamps: true
});

// Ensure one record per user per day for basic metrics
healthMetricSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HealthMetric', healthMetricSchema);