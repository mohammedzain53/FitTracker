# Fitness Progress Tracker

A full-stack MERN application for tracking and visualizing fitness progress over time. Users can log workout sessions, track health metrics, and view detailed analytics with interactive charts and graphs.

## Features

### 🏋️ Workout Tracking
- Log detailed workout sessions with exercises, duration, and calories burned
- Categorize exercises (cardio, strength, flexibility, sports)
- Track workout intensity and mood
- Add personal notes and observations

### 📊 Health Metrics
- Monitor weight, body fat percentage, muscle mass
- Track sleep hours, water intake, and daily steps
- Record resting heart rate and blood pressure
- Daily health metric logging with historical tracking

### 📈 Analytics & Insights
- Interactive dashboards with Chart.js visualizations
- Weekly and monthly workout trends
- Calorie burn analysis and exercise category breakdowns
- Weight progress tracking with trend lines
- Customizable time period analysis (7, 30, 90, 365 days)

### 👤 User Management
- Secure user authentication with JWT
- Personalized profiles with fitness goals
- Activity level tracking and goal setting
- Responsive Material-UI design

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React.js** - UI framework
- **Material-UI** - Component library
- **Chart.js & React-Chartjs-2** - Data visualization
- **Axios** - HTTP client
- **React Router** - Navigation

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd fitness-progress-tracker
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### 4. Environment Configuration
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/fitness-tracker
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
PORT=5000
```

### 5. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB installation
mongod
```

### 6. Seed Sample Data (Optional)
```bash
node scripts/seedData.js
```
This creates a demo user with sample workouts and health metrics:
- **Email:** demo@example.com
- **Password:** password123

### 7. Start the Application

#### Development Mode (Both servers)
```bash
npm run dev
```

#### Separate Servers
```bash
# Backend server (Port 5000)
npm run server

# Frontend server (Port 3000) - in another terminal
npm run client
```

### 8. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Workouts
- `GET /api/workouts` - Get user workouts
- `POST /api/workouts` - Create new workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

### Health Metrics
- `GET /api/metrics` - Get health metrics
- `POST /api/metrics` - Create/update daily metrics
- `GET /api/metrics/latest` - Get latest metrics

### Analytics
- `GET /api/analytics/workouts` - Workout analytics
- `GET /api/analytics/health` - Health metrics analytics
- `GET /api/analytics/dashboard` - Dashboard summary

## Project Structure

```
fitness-progress-tracker/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── App.js
│   └── package.json
├── models/                 # MongoDB models
│   ├── User.js
│   ├── Workout.js
│   └── HealthMetric.js
├── routes/                 # Express routes
│   ├── auth.js
│   ├── workouts.js
│   ├── metrics.js
│   └── analytics.js
├── middleware/             # Custom middleware
│   └── auth.js
├── scripts/                # Utility scripts
│   └── seedData.js
├── server.js               # Express server
├── package.json
└── README.md
```

## Key Features Explained

### Dashboard
- Real-time fitness statistics
- Today's workout and calorie summary
- Weekly progress overview
- Latest health metrics display
- Interactive trend charts

### Workout Management
- Comprehensive exercise logging
- Multiple exercise types per workout
- Intensity and mood tracking
- Historical workout viewing
- Edit and delete functionality

### Analytics
- Multi-period analysis (7, 30, 90, 365 days)
- Workout frequency trends
- Calorie burn patterns
- Exercise category distribution
- Weight progress visualization

### Health Tracking
- Daily metric logging
- Weight trend analysis
- Sleep and activity monitoring
- Hydration tracking
- Custom notes and observations

## Data Models

### User Model
- Authentication credentials
- Personal profile information
- Fitness goals and preferences
- Activity level settings

### Workout Model
- Exercise details and categories
- Duration and calorie tracking
- Intensity and mood ratings
- Personal notes and observations

### Health Metric Model
- Daily health measurements
- Weight and body composition
- Activity and sleep data
- Vital signs tracking

## Future Enhancements

- [ ] Exercise library with instructions
- [ ] Social features and challenges
- [ ] Nutrition tracking integration
- [ ] Wearable device synchronization
- [ ] Progress photos upload
- [ ] Workout plan templates
- [ ] Export data functionality
- [ ] Mobile app development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email [your-email] or create an issue in the repository.