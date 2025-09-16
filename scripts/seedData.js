const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Workout = require('../models/Workout');
const HealthMetric = require('../models/HealthMetric');

const sampleWorkouts = [
  {
    title: "Morning Cardio Session",
    exercises: [
      {
        name: "Running",
        category: "cardio",
        duration: 30,
        distance: 5,
        caloriesBurned: 300,
        notes: "Good pace, felt energetic"
      },
      {
        name: "Cool down walk",
        category: "cardio",
        duration: 10,
        distance: 1,
        caloriesBurned: 50
      }
    ],
    totalDuration: 40,
    totalCaloriesBurned: 350,
    intensity: "moderate",
    mood: "good",
    notes: "Great start to the day!"
  },
  {
    title: "Strength Training - Upper Body",
    exercises: [
      {
        name: "Bench Press",
        category: "strength",
        duration: 20,
        sets: 3,
        reps: 10,
        weight: 70,
        caloriesBurned: 120
      },
      {
        name: "Pull-ups",
        category: "strength",
        duration: 15,
        sets: 3,
        reps: 8,
        caloriesBurned: 80
      },
      {
        name: "Shoulder Press",
        category: "strength",
        duration: 15,
        sets: 3,
        reps: 12,
        weight: 25,
        caloriesBurned: 70
      }
    ],
    totalDuration: 50,
    totalCaloriesBurned: 270,
    intensity: "high",
    mood: "excellent",
    notes: "Personal best on bench press!"
  },
  {
    title: "Yoga Flow",
    exercises: [
      {
        name: "Vinyasa Flow",
        category: "flexibility",
        duration: 45,
        caloriesBurned: 180,
        notes: "Focused on breathing and flexibility"
      }
    ],
    totalDuration: 45,
    totalCaloriesBurned: 180,
    intensity: "low",
    mood: "good",
    notes: "Very relaxing session"
  },
  {
    title: "HIIT Workout",
    exercises: [
      {
        name: "Burpees",
        category: "cardio",
        duration: 10,
        sets: 4,
        reps: 10,
        caloriesBurned: 120
      },
      {
        name: "Mountain Climbers",
        category: "cardio",
        duration: 10,
        sets: 4,
        reps: 20,
        caloriesBurned: 100
      },
      {
        name: "Jump Squats",
        category: "strength",
        duration: 10,
        sets: 4,
        reps: 15,
        caloriesBurned: 90
      }
    ],
    totalDuration: 30,
    totalCaloriesBurned: 310,
    intensity: "extreme",
    mood: "excellent",
    notes: "Intense but rewarding!"
  }
];

const generateHealthMetrics = (userId, startDate, days) => {
  const metrics = [];
  let currentWeight = 75 + Math.random() * 10; // Starting weight between 75-85kg
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);
    
    // Simulate gradual weight change
    currentWeight += (Math.random() - 0.5) * 0.5;
    
    const metric = {
      userId,
      date,
      weight: Math.round(currentWeight * 10) / 10,
      sleepHours: 6 + Math.random() * 3, // 6-9 hours
      stepsCount: Math.floor(5000 + Math.random() * 10000), // 5k-15k steps
      waterIntake: Math.round((1.5 + Math.random() * 2) * 10) / 10, // 1.5-3.5L
    };
    
    // Add occasional additional metrics
    if (Math.random() > 0.7) {
      metric.bodyFatPercentage = Math.round((15 + Math.random() * 10) * 10) / 10;
      metric.restingHeartRate = Math.floor(60 + Math.random() * 20);
    }
    
    metrics.push(metric);
  }
  
  return metrics;
};

const generateWorkouts = (userId, startDate, count) => {
  const workouts = [];
  
  for (let i = 0; i < count; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + Math.floor(i * (30 / count))); // Spread over 30 days
    
    const workout = {
      ...sampleWorkouts[Math.floor(Math.random() * sampleWorkouts.length)],
      userId,
      date,
      // Add some variation
      totalCaloriesBurned: Math.floor(200 + Math.random() * 300),
      totalDuration: Math.floor(20 + Math.random() * 60)
    };
    
    workouts.push(workout);
  }
  
  return workouts;
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Workout.deleteMany({});
    await HealthMetric.deleteMany({});
    console.log('Cleared existing data');

    // Create sample user
    const hashedPassword = await bcrypt.hash('password123', 12);
    const user = new User({
      username: 'demo_user',
      email: 'demo@example.com',
      password: hashedPassword,
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        age: 28,
        height: 175,
        gender: 'male',
        activityLevel: 'moderately_active'
      },
      goals: {
        targetWeight: 70,
        weeklyWorkoutGoal: 4,
        dailyCalorieGoal: 2200
      }
    });

    await user.save();
    console.log('Created demo user');

    // Generate sample data
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Start 30 days ago

    // Create health metrics
    const healthMetrics = generateHealthMetrics(user._id, startDate, 30);
    await HealthMetric.insertMany(healthMetrics);
    console.log(`Created ${healthMetrics.length} health metrics`);

    // Create workouts
    const workouts = generateWorkouts(user._id, startDate, 15);
    await Workout.insertMany(workouts);
    console.log(`Created ${workouts.length} workouts`);

    console.log('\n=== Sample Data Created Successfully! ===');
    console.log('Demo User Credentials:');
    console.log('Email: demo@example.com');
    console.log('Password: password123');
    console.log('\nYou can now start the application and login with these credentials.');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeder
seedDatabase();