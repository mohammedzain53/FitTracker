const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Workout = require('../models/Workout');
const HealthMetric = require('../models/HealthMetric');

const fixUserIds = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker');
    console.log('Connected to MongoDB');

    // Check current workouts
    const allWorkouts = await Workout.find({});
    console.log(`Found ${allWorkouts.length} workouts`);

    let fixedWorkouts = 0;
    let fixedMetrics = 0;

    // Fix workouts with string userIds
    for (const workout of allWorkouts) {
      if (typeof workout.userId === 'string') {
        console.log(`Fixing workout ${workout._id} with string userId: ${workout.userId}`);
        try {
          await Workout.updateOne(
            { _id: workout._id },
            { userId: new mongoose.Types.ObjectId(workout.userId) }
          );
          fixedWorkouts++;
        } catch (error) {
          console.error(`Error fixing workout ${workout._id}:`, error.message);
        }
      }
    }

    // Check current health metrics
    const allMetrics = await HealthMetric.find({});
    console.log(`Found ${allMetrics.length} health metrics`);

    // Fix health metrics with string userIds
    for (const metric of allMetrics) {
      if (typeof metric.userId === 'string') {
        console.log(`Fixing metric ${metric._id} with string userId: ${metric.userId}`);
        try {
          await HealthMetric.updateOne(
            { _id: metric._id },
            { userId: new mongoose.Types.ObjectId(metric.userId) }
          );
          fixedMetrics++;
        } catch (error) {
          console.error(`Error fixing metric ${metric._id}:`, error.message);
        }
      }
    }

    console.log(`\n=== MIGRATION COMPLETE ===`);
    console.log(`Fixed ${fixedWorkouts} workouts`);
    console.log(`Fixed ${fixedMetrics} health metrics`);

    // Verify the fix
    const verifyWorkouts = await Workout.find({});
    console.log('\n=== VERIFICATION ===');
    verifyWorkouts.forEach((workout, index) => {
      if (index < 3) { // Show first 3 workouts
        console.log(`Workout ${workout._id}:`, {
          userId: workout.userId,
          userIdType: typeof workout.userId,
          title: workout.title
        });
      }
    });

  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the migration
fixUserIds();