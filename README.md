# EyeRest - Digital Wellness Application

A comprehensive React web application designed to help users maintain healthy digital habits by providing customizable timers for eye rest breaks and posture checks, following the 20-20-20 rule with advanced features like exercise video demonstrations, streak tracking, and sound customization.

## 🌟 Features

### Core Timer Features
- **Dual Timers**: Separate eye break (20 min default) and posture check (45 min default) timers
- **20-20-20 Rule**: Automated reminders to look at something 20 feet away for 20 seconds
- **Timer Persistence**: Continues tracking across page reloads and browser sessions
- **1-Minute Precision**: Customizable intervals with 1-minute increments

### Advanced Features
- **Exercise Video Demonstrations**: 5 guided exercise routines with visual demonstrations
  - 20-20-20 Eye Exercise
  - Neck Stretch Routine
  - Shoulder Roll Exercise  
  - Wrist and Hand Stretches
  - Deep Breathing Exercise
- **Streak Tracking & Statistics**: 
  - Daily activity tracking with visual calendar
  - Weekly progress monitoring
  - Longest streak records
  - Motivational messaging system
- **Advanced Sound Customization**:
  - 4 different notification sounds (Beep, Chime, Bell, Nature)
  - Volume and duration controls
  - Sound testing functionality
- **Smart Notifications**: Browser notifications with sound alerts and auto-close
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Database & Persistence
- **PostgreSQL Integration**: Full database backing for user data
- **User Management**: Account creation and authentication
- **Settings Synchronization**: Cloud-based settings storage
- **Session Tracking**: Detailed history of timer sessions
- **Daily Statistics**: Comprehensive usage analytics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Local Development Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd eyerest-app
   npm install
   ```

2. **Database Setup**
   ```bash
   # Create a PostgreSQL database
   createdb eyerest_db
   
   # Set your database URL environment variable
   export DATABASE_URL="postgresql://username:password@localhost:5432/eyerest_db"
   ```

3. **Initialize Database Schema**
   ```bash
   npm run db:push
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Application**
   Navigate to `http://localhost:5000` in your browser

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/eyerest_db
NODE_ENV=development
```

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript  
- **Database**: PostgreSQL + Drizzle ORM
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: React hooks + TanStack Query
- **Routing**: Wouter (lightweight client-side routing)

### Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   └── pages/          # Application pages
├── server/                 # Backend Express server
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database storage layer
│   └── db.ts              # Database connection
├── shared/                 # Shared type definitions
│   └── schema.ts          # Database schema & types
└── package.json           # Dependencies & scripts
```

### Database Schema
- **Users**: User accounts with authentication
- **User Settings**: Timer preferences and notification settings
- **Timer Sessions**: Individual session tracking
- **Daily Stats**: Daily usage statistics and progress

## 🎮 Usage Guide

### Basic Operation
1. **Start Timers**: Click play buttons on Eye Break or Posture Check timers
2. **Customize Intervals**: Use settings modal to adjust timer durations
3. **Enable Notifications**: Allow browser notifications for alerts
4. **Track Progress**: View statistics panel for daily and weekly progress

### Advanced Features
1. **Exercise Videos**: Click "Guided Exercises" tab for video demonstrations
2. **Sound Settings**: Configure notification sounds in settings > Advanced sound settings
3. **Streak Tracking**: Complete daily goals to build wellness streaks
4. **Statistics**: Monitor your progress with detailed analytics

### Keyboard Shortcuts
- `Space`: Start/pause active timer
- `R`: Reset current timer (with confirmation)
- `S`: Open settings modal
- `Esc`: Close modals and dialogs

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:push      # Push database schema changes
npm run db:studio    # Open database management interface
npm test             # Run test suite
npm run lint         # Run ESLint
```

### API Endpoints

#### User Management
- `POST /api/users` - Create user account
- `GET /api/users/:id` - Get user information

#### Settings
- `GET /api/users/:id/settings` - Get user settings
- `PUT /api/users/:id/settings` - Update user settings

#### Timer Sessions
- `POST /api/timer-sessions` - Record timer session
- `GET /api/users/:id/timer-sessions` - Get user sessions

#### Statistics
- `GET /api/users/:id/stats/:date` - Get daily statistics
- `PUT /api/users/:id/stats/:date` - Update daily statistics
- `GET /api/users/:id/stats/weekly` - Get weekly summary

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Optimized layouts for small screens
- Progressive Web App capabilities
- Offline functionality with localStorage fallback

## 🔐 Privacy & Data

- **Local Storage**: Timer state and preferences stored locally
- **Database**: Optional cloud sync for enhanced features
- **No Tracking**: No analytics or tracking cookies
- **Secure**: HTTPS enforced in production
- **Open Source**: Transparent codebase

## 🛠️ Deployment

### Replit Deployment (Recommended)
1. Push code to repository
2. Connect to Replit
3. Configure environment variables
4. Deploy with built-in PostgreSQL database

### Manual Deployment
1. Build the application: `npm run build`
2. Set up PostgreSQL database
3. Configure environment variables
4. Start server: `npm start`
5. Serve on your preferred hosting platform

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, questions, or feature requests:
- Create an issue on GitHub
- Contact: [your-email@example.com]

## 🎯 Roadmap

### Upcoming Features
- **Mobile App**: React Native mobile application
- **Team Features**: Shared challenges and leaderboards
- **Integrations**: Calendar sync and productivity app connections
- **Advanced Analytics**: Detailed health metrics and insights
- **Accessibility**: Enhanced screen reader and keyboard navigation support

---

**Start building healthier digital habits today with EyeRest!** 👁️ 🧘 💪