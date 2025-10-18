import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Fab
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  FitnessCenter,
  Timer,
  LocalFireDepartment
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';

const WorkoutCard = ({ workout, onEdit, onDelete }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {workout.title}
        </Typography>
        <Chip 
          label={workout.intensity} 
          color={
            workout.intensity === 'extreme' ? 'error' :
            workout.intensity === 'high' ? 'warning' :
            workout.intensity === 'moderate' ? 'info' : 'success'
          }
          size="small"
        />
      </Box>
      
      <Typography color="text.secondary" gutterBottom sx={{ fontSize: '0.9rem' }}>
        {format(new Date(workout.date), 'MMM dd, yyyy')}
      </Typography>
      
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Timer fontSize="small" color="primary" />
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {workout.totalDuration} min
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={0.5}>
          <LocalFireDepartment fontSize="small" color="secondary" />
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {workout.totalCaloriesBurned} cal
          </Typography>
        </Box>
      </Box>

      <Box mb={2}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>{workout.exercises?.length || 0}</strong> exercise{(workout.exercises?.length || 0) !== 1 ? 's' : ''}
        </Typography>
        
        {workout.exercises && workout.exercises.length > 0 && (
          <Box>
            {workout.exercises.slice(0, 3).map((exercise, index) => (
              <Chip
                key={index}
                label={exercise.name}
                size="small"
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5, fontSize: '0.75rem' }}
              />
            ))}
            {workout.exercises.length > 3 && (
              <Chip
                label={`+${workout.exercises.length - 3} more`}
                size="small"
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5, fontSize: '0.75rem' }}
              />
            )}
          </Box>
        )}
      </Box>

      {workout.mood && (
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Typography variant="body2" color="text.secondary">
            Mood: <strong style={{ textTransform: 'capitalize' }}>{workout.mood}</strong>
          </Typography>
        </Box>
      )}
      
      {workout.notes && (
        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
          "{workout.notes}"
        </Typography>
      )}
    </CardContent>
    
    <CardActions>
      <IconButton size="small" onClick={() => onEdit(workout)} color="primary">
        <Edit />
      </IconButton>
      <IconButton size="small" onClick={() => onDelete(workout._id)} color="error">
        <Delete />
      </IconButton>
    </CardActions>
  </Card>
);

const WorkoutDialog = ({ open, onClose, workout, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    totalDuration: '',
    totalCaloriesBurned: '',
    intensity: 'moderate',
    mood: '',
    notes: '',
    exercises: []
  });

  useEffect(() => {
    if (workout) {
      setFormData({
        ...workout,
        date: new Date(workout.date).toISOString().split('T')[0]
      });
    } else {
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        totalDuration: '',
        totalCaloriesBurned: '',
        intensity: 'moderate',
        mood: '',
        notes: '',
        exercises: [{
          name: '',
          category: 'cardio',
          duration: '',
          sets: '',
          reps: '',
          weight: '',
          distance: '',
          caloriesBurned: '',
          notes: ''
        }]
      });
    }
  }, [workout, open]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...formData.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value
    };
    setFormData({
      ...formData,
      exercises: updatedExercises
    });
  };

  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [
        ...formData.exercises,
        {
          name: '',
          category: 'cardio',
          duration: '',
          sets: '',
          reps: '',
          weight: '',
          distance: '',
          caloriesBurned: '',
          notes: ''
        }
      ]
    });
  };

  const removeExercise = (index) => {
    const updatedExercises = formData.exercises.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      exercises: updatedExercises
    });
  };

  const calculateTotals = () => {
    const totalDuration = formData.exercises.reduce((sum, ex) => sum + (parseInt(ex.duration) || 0), 0);
    const totalCalories = formData.exercises.reduce((sum, ex) => sum + (parseInt(ex.caloriesBurned) || 0), 0);
    
    setFormData({
      ...formData,
      totalDuration: totalDuration.toString(),
      totalCaloriesBurned: totalCalories.toString()
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Filter out empty exercises
      const validExercises = formData.exercises.filter(ex => ex.name.trim() !== '');
      const workoutData = {
        ...formData,
        exercises: validExercises
      };
      
      if (workout) {
        await axios.put(`/api/workouts/${workout._id}`, workoutData);
      } else {
        await axios.post('/api/workouts', workoutData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {workout ? 'Edit Workout' : 'Add New Workout'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Workout Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                name="totalDuration"
                type="number"
                value={formData.totalDuration}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Calories Burned"
                name="totalCaloriesBurned"
                type="number"
                value={formData.totalCaloriesBurned}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Intensity</InputLabel>
                <Select
                  name="intensity"
                  value={formData.intensity}
                  onChange={handleChange}
                  label="Intensity"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="moderate">Moderate</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="extreme">Extreme</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Mood</InputLabel>
                <Select
                  name="mood"
                  value={formData.mood}
                  onChange={handleChange}
                  label="Mood"
                >
                  <MenuItem value="">Select Mood</MenuItem>
                  <MenuItem value="excellent">Excellent</MenuItem>
                  <MenuItem value="good">Good</MenuItem>
                  <MenuItem value="average">Average</MenuItem>
                  <MenuItem value="poor">Poor</MenuItem>
                  <MenuItem value="terrible">Terrible</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Exercises Section */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Exercises</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Add />}
                  onClick={addExercise}
                >
                  Add Exercise
                </Button>
              </Box>
              
              {formData.exercises.map((exercise, index) => (
                <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle1">Exercise {index + 1}</Typography>
                    {formData.exercises.length > 1 && (
                      <IconButton size="small" onClick={() => removeExercise(index)}>
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Exercise Name"
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                          value={exercise.category}
                          onChange={(e) => handleExerciseChange(index, 'category', e.target.value)}
                          label="Category"
                        >
                          <MenuItem value="cardio">Cardio</MenuItem>
                          <MenuItem value="strength">Strength</MenuItem>
                          <MenuItem value="flexibility">Flexibility</MenuItem>
                          <MenuItem value="sports">Sports</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        fullWidth
                        label="Duration (min)"
                        type="number"
                        value={exercise.duration}
                        onChange={(e) => handleExerciseChange(index, 'duration', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        fullWidth
                        label="Calories"
                        type="number"
                        value={exercise.caloriesBurned}
                        onChange={(e) => handleExerciseChange(index, 'caloriesBurned', e.target.value)}
                      />
                    </Grid>
                    
                    {exercise.category === 'strength' && (
                      <>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            label="Sets"
                            type="number"
                            value={exercise.sets}
                            onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            label="Reps"
                            type="number"
                            value={exercise.reps}
                            onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            label="Weight (kg)"
                            type="number"
                            value={exercise.weight}
                            onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                          />
                        </Grid>
                      </>
                    )}
                    
                    {exercise.category === 'cardio' && (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Distance (km)"
                          type="number"
                          step="0.1"
                          value={exercise.distance}
                          onChange={(e) => handleExerciseChange(index, 'distance', e.target.value)}
                        />
                      </Grid>
                    )}
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Exercise Notes"
                        value={exercise.notes}
                        onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
              
              <Button
                variant="outlined"
                onClick={calculateTotals}
                sx={{ mb: 2 }}
              >
                Calculate Totals from Exercises
              </Button>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Workout Notes"
                name="notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {workout ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get('/api/workouts');
      setWorkouts(response.data.workouts);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleEdit = (workout) => {
    setEditingWorkout(workout);
    setDialogOpen(true);
  };

  const handleDelete = async (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await axios.delete(`/api/workouts/${workoutId}`);
        fetchWorkouts();
      } catch (error) {
        console.error('Error deleting workout:', error);
      }
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingWorkout(null);
  };

  const handleSave = () => {
    fetchWorkouts();
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading workouts...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          My Workouts
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
        >
          Add Workout
        </Button>
      </Box>

      {workouts.length === 0 ? (
        <Box textAlign="center" py={8}>
          <FitnessCenter sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No workouts recorded yet
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Start tracking your fitness journey by adding your first workout!
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
          >
            Add Your First Workout
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {workouts.map((workout) => (
            <Grid item xs={12} sm={6} md={4} key={workout._id}>
              <WorkoutCard
                workout={workout}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <WorkoutDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        workout={editingWorkout}
        onSave={handleSave}
      />

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setDialogOpen(true)}
      >
        <Add />
      </Fab>
    </Container>
  );
};

export default Workouts;