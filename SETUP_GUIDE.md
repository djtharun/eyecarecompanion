# EyeRest - Local Development Setup Guide

This guide will walk you through setting up the EyeRest application on your local system with all advanced features including exercise videos, streak tracking, and sound customization.

## 🚀 Quick Setup (5 minutes)

### Prerequisites
- **Node.js 18+** (Download from [nodejs.org](https://nodejs.org/))
- **PostgreSQL 13+** (Download from [postgresql.org](https://www.postgresql.org/download/))
- **Git** (Download from [git-scm.com](https://git-scm.com/))

### Step 1: Clone and Install
```bash
# Clone the repository
git clone <your-repository-url>
cd eyerest-app

# Install dependencies
npm install
```

### Step 2: Database Setup
```bash
# Start PostgreSQL service (varies by OS)
# On macOS with Homebrew:
brew services start postgresql

# On Windows:
# Use pgAdmin or start PostgreSQL service from Services

# On Linux:
sudo systemctl start postgresql

# Create database
createdb eyerest_dev

# Or using psql:
psql -U postgres -c "CREATE DATABASE eyerest_dev;"
```

### Step 3: Environment Configuration
Create a `.env` file in the project root:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/eyerest_dev

# Development Settings
NODE_ENV=development
PORT=5000

# Optional: Custom database connection details
PGHOST=localhost
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=eyerest_dev
```

Replace `username` and `password` with your PostgreSQL credentials.

### Step 4: Initialize Database
```bash
# Push database schema
npm run db:push
```

### Step 5: Start Development Server
```bash
# Start the application
npm run dev
```

### Step 6: Open Application
Open your browser and navigate to:
```
http://localhost:5000
```

## 🎯 Verifying Your Setup

### 1. Check Database Connection
Test the API endpoint:
```bash
curl http://localhost:5000/api/health
```
Should return: `{"status":"ok","message":"EyeRest API is running"}`

### 2. Test User Creation
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass"}'
```

### 3. Verify Features
In the web application:
- ✅ **Timers**: Start eye break and posture timers
- ✅ **Notifications**: Enable browser notifications
- ✅ **Sound Settings**: Test different notification sounds
- ✅ **Exercise Videos**: Navigate to "Guided Exercises" tab
- ✅ **Streak Tracking**: Complete activities to see progress
- ✅ **Statistics**: View daily and weekly progress

## 🛠️ Detailed Installation by Operating System

### macOS Setup
```bash
# Install Node.js via Homebrew
brew install node

# Install PostgreSQL
brew install postgresql
brew services start postgresql

# Create database user (optional)
createuser -s your_username

# Clone and setup project
git clone <repository-url>
cd eyerest-app
npm install

# Setup environment
echo "DATABASE_URL=postgresql://$(whoami)@localhost:5432/eyerest_dev" > .env

# Create database and run
createdb eyerest_dev
npm run db:push
npm run dev
```

### Windows Setup
```powershell
# Install Node.js from nodejs.org
# Install PostgreSQL from postgresql.org

# Clone project
git clone <repository-url>
cd eyerest-app
npm install

# Create .env file
echo DATABASE_URL=postgresql://postgres:your_password@localhost:5432/eyerest_dev > .env

# Create database using pgAdmin or command line
# Run application
npm run db:push
npm run dev
```

### Linux (Ubuntu/Debian) Setup
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Setup PostgreSQL
sudo -u postgres createuser --createdb --login your_username
sudo -u postgres createdb eyerest_dev

# Clone and setup
git clone <repository-url>
cd eyerest-app
npm install

echo "DATABASE_URL=postgresql://your_username@localhost:5432/eyerest_dev" > .env

npm run db:push
npm run dev
```

## 🏗️ Advanced Configuration

### Database Configuration Options

#### Using Different PostgreSQL Host
```env
DATABASE_URL=postgresql://username:password@your_host:5432/eyerest_dev
```

#### Using Environment Variables
```env
PGHOST=your_host
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=eyerest_dev
```

#### Using Cloud Database (Neon, Supabase, etc.)
```env
DATABASE_URL=postgresql://user:pass@cloud-host.com:5432/database?sslmode=require
```

### Development Tools

#### Database Management
```bash
# View database schema
npm run db:studio

# Reset database (careful!)
npm run db:reset

# Generate migration files
npm run db:generate

# View database directly
psql $DATABASE_URL
```

#### Development Scripts
```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Type checking
npm run type-check
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check PostgreSQL is running
pg_ctl status

# Check connection string
psql $DATABASE_URL

# Common fixes:
# - Verify username/password
# - Check if database exists
# - Ensure PostgreSQL is running
```

#### 2. Port Already in Use
```bash
# Kill process on port 5000
sudo lsof -i :5000
sudo kill -9 <PID>

# Or use different port
PORT=3000 npm run dev
```

#### 3. Node Modules Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### 4. Database Schema Issues
```bash
# Reset and recreate schema
npm run db:reset
npm run db:push
```

### Environment-Specific Issues

#### macOS
- **M1/M2 Macs**: Ensure using arm64 version of Node.js
- **Permission Issues**: Use `sudo` for global npm installs

#### Windows
- **Path Issues**: Use Git Bash or PowerShell
- **PostgreSQL Service**: Start via Services or pgAdmin

#### Linux
- **Permission Issues**: Use correct user for PostgreSQL
- **Service Management**: Use systemctl for PostgreSQL

## 📱 Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
PORT=5000
```

### Build and Deploy
```bash
# Build application
npm run build

# Start production server
npm start
```

### Deployment Platforms

#### Replit (Recommended)
1. Push code to GitHub
2. Import to Replit
3. Configure PostgreSQL database
4. Set environment variables
5. Deploy with one click

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Vercel + Neon Database
1. Deploy frontend to Vercel
2. Set up Neon PostgreSQL
3. Configure environment variables
4. Deploy backend to Railway/Render

## 🎯 Feature Testing Checklist

### Core Features
- [ ] Eye break timer (20 minutes default)
- [ ] Posture check timer (45 minutes default)
- [ ] Timer persistence across page reloads
- [ ] Settings customization (1-minute increments)
- [ ] Browser notifications
- [ ] Reset confirmation dialogs

### Advanced Features
- [ ] Exercise video demonstrations (5 routines)
- [ ] Sound customization (4 different sounds)
- [ ] Volume and duration controls
- [ ] Streak tracking system
- [ ] Daily activity calendar
- [ ] Weekly progress monitoring
- [ ] Statistics dashboard
- [ ] Database persistence

### Mobile Responsiveness
- [ ] Responsive design on mobile
- [ ] Touch-friendly interface
- [ ] Proper scaling on different screen sizes

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Guide](https://www.typescriptlang.org/docs/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Development Tools
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [VS Code Extensions](https://marketplace.visualstudio.com/)

## 🤝 Getting Help

If you encounter issues:

1. **Check Logs**: Look at console output and browser dev tools
2. **Verify Environment**: Double-check .env file and database connection
3. **Database Status**: Ensure PostgreSQL is running and accessible
4. **Clear Cache**: Try clearing browser cache and npm cache
5. **Restart Services**: Restart PostgreSQL and development server

### Development Support
- Check GitHub Issues for known problems
- Review API endpoints with browser dev tools
- Use `npm run db:studio` for database debugging
- Enable detailed logging in development mode

---

**Congratulations!** 🎉 You now have a fully functional EyeRest application running locally with all advanced features including exercise videos, streak tracking, sound customization, and database persistence.

Start building healthier digital habits today! 👁️ 🧘 💪