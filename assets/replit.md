# BYFORT - TikTok Clone Application

## Overview

This is a modern full-stack TikTok clone application built with React, Express, and PostgreSQL. The application provides core social media features including video uploading, user profiles, social interactions (likes, comments, follows), and a monetization system. It uses Firebase for authentication and file storage, with a clean mobile-first design using Tailwind CSS and Radix UI components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **State Management**: TanStack Query for server state, React Context for auth
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Firebase Auth integration
- **File Storage**: Firebase Storage for video/image uploads
- **API Design**: RESTful API with JSON responses

### Mobile-First Design
- Responsive design optimized for mobile devices
- Touch-friendly interface with swipe gestures
- Bottom navigation pattern similar to TikTok
- Dark theme with gradient accents (pink/blue)

## Key Components

### Authentication System
- Firebase Authentication with Google OAuth support
- Email/password registration and login
- User profile creation and management
- Persistent session handling with redirect management

### Video Management
- Video upload with Firebase Storage integration
- Video feed with infinite scroll capability
- Video statistics tracking (views, likes, comments, shares)
- Video player with touch controls and gestures

### Social Features
- User following/follower system
- Video likes and comments with nested replies
- Real-time interaction tracking
- User discovery and search functionality

### Monetization System
- Creator earnings tracking
- Revenue analytics dashboard
- Payment processing integration ready
- Commission and fee management

### Database Schema
- **Users**: Profile information, follower counts, verification status
- **Videos**: Content metadata, statistics, privacy settings
- **Comments**: Threaded comments with like counts
- **Follows**: User relationship tracking
- **Likes**: Video interaction tracking
- **Music**: Audio content for videos
- **Monetization**: Creator revenue and analytics

## Data Flow

### Video Upload Process
1. User selects video file in UploadModal
2. File uploaded to Firebase Storage
3. Video metadata saved to PostgreSQL via API
4. Video appears in user's profile and public feed

### Authentication Flow
1. User signs in with Firebase Auth
2. AuthContext manages Firebase user state
3. Backend creates/retrieves user profile from PostgreSQL
4. User data synchronized between Firebase and PostgreSQL

### Feed Generation
1. Frontend requests video feed from API
2. Backend queries videos with pagination
3. Videos returned with creator information
4. Frontend displays in swipeable video player

### Social Interactions
1. User actions (like, comment, follow) trigger API calls
2. Backend updates database counters and relationships
3. TanStack Query invalidates and refetches affected data
4. UI updates reflect new interaction state

## External Dependencies

### Firebase Services
- **Authentication**: User sign-in/sign-up management
- **Storage**: Video and image file hosting
- **Configuration**: Environment-based project setup

### Database
- **PostgreSQL**: Primary data storage via Neon Database
- **Drizzle ORM**: Type-safe database queries and migrations
- **Connection**: Serverless PostgreSQL connection pooling

### UI/UX Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library
- **TanStack Query**: Server state management and caching

### Development Tools
- **Vite**: Fast development server and bundling
- **TypeScript**: Type safety across the stack
- **ESLint/Prettier**: Code formatting and linting

## Deployment Strategy

### Build Process
- Frontend builds to `dist/public` directory
- Backend compiles TypeScript to `dist/index.js`
- Database migrations run via Drizzle Kit
- Environment variables configured for production

### Production Setup
- Express server serves both API and static frontend
- Database connection via environment variable
- Firebase configuration via environment variables
- File uploads handled by Firebase Storage

### Development Environment
- Vite dev server with HMR for frontend development
- TSX for TypeScript execution in development
- Database schema changes via `db:push` command
- Local environment variable configuration

The application follows modern full-stack patterns with clear separation of concerns, type safety throughout, and mobile-optimized user experience similar to popular social media platforms.