const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://fit-tracker-live.vercel.app']
    : ['http://localhost:3000', 'http://192.168.1.35:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/workouts', require('./routes/workouts'));
app.use('/api/metrics', require('./routes/metrics'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Fitness Tracker API is running!' });
});

// Simple test endpoint to check database
app.get('/api/test/data', async (req, res) => {
  try {
    const Workout = require('./models/Workout');
    const User = require('./models/User');
    
    const userCount = await User.countDocuments();
    const workoutCount = await Workout.countDocuments();
    
    const users = await User.find({}, '_id username email').limit(5);
    const workouts = await Workout.find({}, '_id userId title date totalCaloriesBurned').limit(5);
    
    res.json({
      userCount,
      workoutCount,
      users: users.map(u => ({
        id: u._id.toString(),
        username: u.username,
        email: u.email
      })),
      workouts: workouts.map(w => ({
        id: w._id.toString(),
        userId: w.userId.toString(),
        title: w.title,
        date: w.date,
        calories: w.totalCaloriesBurned
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to check current user data
app.get('/api/debug/me', require('./middleware/auth'), async (req, res) => {
  try {
    const Workout = require('./models/Workout');
    const User = require('./models/User');
    const mongoose = require('mongoose');
    
    console.log('=== DEBUG ENDPOINT CALLED ===');
    console.log('Token userId:', req.userId);
    
    const user = await User.findById(req.userId);
    console.log('User found:', !!user, user?.username);
    
    // Check all users to see what IDs exist
    const allUsers = await User.find({}, '_id username');
    console.log('All users in DB:', allUsers.map(u => ({ id: u._id.toString(), username: u.username })));
    
    // Check all workouts to see what userIds exist
    const allWorkouts = await Workout.find({}, 'userId title').limit(5);
    console.log('Sample workout userIds:', allWorkouts.map(w => ({ userId: w.userId.toString(), title: w.title })));
    
    const workoutsObjectId = await Workout.find({ userId: new mongoose.Types.ObjectId(req.userId) });
    console.log('Workouts found for current user:', workoutsObjectId.length);
    
    res.json({ 
      tokenUserId: req.userId,
      userExists: !!user,
      username: user?.username,
      allUsers: allUsers.map(u => ({ id: u._id.toString(), username: u.username })),
      workoutCount: workoutsObjectId.length,
      workouts: workoutsObjectId.map(w => ({
        id: w._id,
        title: w.title,
        date: w.date,
        totalCaloriesBurned: w.totalCaloriesBurned,
        totalDuration: w.totalDuration,
        exercises: w.exercises?.length || 0
      }))
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to check data
app.get('/api/debug/workouts/:userId', async (req, res) => {
  try {
    const Workout = require('./models/Workout');
    const workouts = await Workout.find({ userId: req.params.userId });
    const workoutsWithObjectId = await Workout.find({ userId: new require('mongoose').Types.ObjectId(req.params.userId) });
    res.json({ 
      userId: req.params.userId,
      countString: workouts.length, 
      countObjectId: workoutsWithObjectId.length,
      workouts: workouts.map(w => ({
        id: w._id,
        userId: w.userId,
        title: w.title,
        date: w.date,
        exercises: w.exercises?.length || 0
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Access from network: http://192.168.1.35:${PORT}`);
    console.log(`Access locally: http://localhost:${PORT}`);
  }
});