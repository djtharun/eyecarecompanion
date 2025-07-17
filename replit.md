# EyeRest - Digital Wellness Application

## Overview

EyeRest is a React-based web application designed to help users maintain healthy digital habits by providing timers for eye rest breaks and posture checks. The application follows the 20-20-20 rule (every 20 minutes, look at something 20 feet away for 20 seconds) and includes customizable timers, notifications, and exercise instructions.

## Recent Changes (January 17, 2025)

✓ Fixed NaN display error in timer components
✓ Added sound notifications using Web Audio API
✓ Added timer persistence across page reloads using localStorage
✓ Changed settings sliders to 1-minute increments instead of 5-minute steps
✓ Added confirmation dialog for timer reset operations
✓ Improved timer state management with automatic save/restore functionality
✓ Added PostgreSQL database with comprehensive schema for users, settings, sessions, and statistics
✓ Implemented full API endpoints for data persistence and retrieval

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with custom styling (shadcn/ui pattern)
- **State Management**: React hooks for local state, TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: PostgreSQL session store (connect-pg-simple)

### Build and Development
- **Development**: tsx for TypeScript execution
- **Production Build**: Vite for client, esbuild for server
- **Deployment**: Single-server deployment with static file serving

## Key Components

### Client-Side Components
1. **Timer System**: Dual timers for eye breaks (20 min default) and posture checks (45 min default) with persistence across page reloads
2. **Notification System**: Browser notifications with permission handling and optional sound alerts using Web Audio API
3. **Settings Management**: Configurable intervals (1-minute increments), notification preferences, and auto-start options
4. **Exercise Instructions**: Tabbed interface showing eye exercises and posture tips
5. **Statistics Tracking**: Local storage-based progress tracking
6. **Reset Confirmation**: Alert dialog prevents accidental timer resets

### Server-Side Components
1. **API Routes**: RESTful endpoints under `/api` prefix for users, settings, sessions, and statistics
2. **Storage Interface**: Abstracted storage layer with DatabaseStorage implementation using PostgreSQL
3. **User Management**: Comprehensive user system with settings, session tracking, and statistics
4. **Database Layer**: Drizzle ORM with Neon PostgreSQL for data persistence
5. **Static File Serving**: Vite integration for development, static serving for production

### Database Schema
- **Users Table**: id (serial), username (unique text), password (text), createdAt (timestamp)
- **User Settings Table**: id, userId, eyeInterval, postureInterval, notification preferences, updatedAt
- **Timer Sessions Table**: id, userId, timerType (eye/posture), duration, completed status, timestamps
- **Daily Stats Table**: id, userId, date, eyeBreaksCompleted, postureChecksCompleted, totalFocusTime
- **Relations**: Properly defined relationships between users and their data using Drizzle ORM

## Data Flow

### Client State Management
1. **Timer State**: Custom hooks manage countdown timers with start/stop/reset functionality and automatic persistence to localStorage
2. **Settings Persistence**: localStorage for user preferences and statistics
3. **Notification Flow**: Permission request → notification display with optional sound → auto-close after 5 seconds
4. **Timer Persistence**: Automatic save/restore of timer state including elapsed time calculation during page reloads

### Server-Client Communication
1. **API Requests**: TanStack Query for server state management
2. **Session Management**: Cookie-based sessions with PostgreSQL storage
3. **Error Handling**: Centralized error handling with custom error boundaries

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **UI Framework**: Radix UI for accessible components
- **Form Handling**: React Hook Form with Zod validation
- **Date Utilities**: date-fns for time formatting and calculations

### Development Dependencies
- **Vite Plugins**: React plugin, runtime error overlay, Replit cartographer
- **Database Tools**: Drizzle Kit for schema management and migrations
- **Build Tools**: esbuild for server bundling, PostCSS for CSS processing

## Deployment Strategy

### Development Environment
- **Hot Module Replacement**: Vite HMR with Express middleware integration
- **Error Handling**: Runtime error overlay for development debugging
- **Database**: Drizzle push for schema synchronization

### Production Environment
- **Build Process**: Separate builds for client (Vite) and server (esbuild)
- **Static Assets**: Client built to `dist/public`, served by Express
- **Database**: Migrations managed through Drizzle Kit
- **Environment Variables**: `DATABASE_URL` required for PostgreSQL connection

### Key Design Decisions
1. **Monorepo Structure**: Shared schema between client and server for type safety
2. **Storage Abstraction**: Interface allows switching between in-memory and database storage
3. **Progressive Enhancement**: App works offline with localStorage, enhances with server features
4. **Modular UI**: Component-based architecture with reusable UI primitives
5. **TypeScript Throughout**: Full type safety from database to UI components

The application prioritizes user experience with smooth animations, accessible design, and offline functionality while maintaining a clean, maintainable codebase.