# Heartwood Online Game

## Overview

Heartwood Online is a web-based multiplayer game with a medieval fantasy theme. The application follows a client-server architecture with a React frontend and Express.js backend. The game uses Three.js/React Three Fiber for 3D rendering and Phaser.js for 2D game elements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

- **Framework**: React with TypeScript
- **3D Rendering**: React Three Fiber (Three.js wrapper for React)
- **2D Game Engine**: Phaser.js
- **UI Components**: Radix UI with Tailwind CSS for styling
- **State Management**: Zustand for global state

The frontend is built as a single-page application (SPA) using Vite as the build tool. The application uses a component-based architecture with various UI components from Radix UI library, styled using Tailwind CSS.

### Backend Architecture

- **Server**: Express.js running on Node.js
- **API**: RESTful API structure
- **Database Access**: Drizzle ORM
- **Session Management**: Planned implementation with connect-pg-simple

The backend provides API endpoints for game state management, user authentication, and data persistence. It follows a modular structure with separate routes for different functionality areas.

### Data Storage

- **ORM**: Drizzle ORM
- **Database**: Designed for PostgreSQL (currently using in-memory storage)
- **Schema**: Simple user schema defined in `/shared/schema.ts`

The application is designed to work with a PostgreSQL database but is currently using in-memory storage for development purposes. The database schema is defined using Drizzle ORM and includes user authentication information.

## Key Components

### Client Components

1. **Game Engine Integration**
   - Phaser.js for 2D game rendering
   - React Three Fiber for 3D elements

2. **UI Components**
   - Extensive set of UI components based on Radix UI primitives
   - Custom game interface components

3. **Game Scenes**
   - BootScene: Initial loading scene
   - PreloadScene: Asset preloading
   - LoginScene: User authentication

4. **State Management**
   - Game state using Zustand
   - Audio management store

### Server Components

1. **API Routes**
   - User authentication endpoints
   - Game state management

2. **Storage Interface**
   - Generic storage interface for database operations
   - In-memory implementation for development

3. **Middleware**
   - Request logging
   - Error handling

## Data Flow

1. **Authentication Flow**
   - User credentials are sent to the server
   - Server validates and creates session
   - Client stores session token for authenticated requests

2. **Game State Flow**
   - Game state is managed on the client using Zustand stores
   - Critical game state changes are sent to the server for persistence
   - Server broadcasts state changes to other players

3. **Audio Management**
   - Audio files are loaded at application startup
   - Audio state (muted/unmuted) is managed through Zustand store
   - Sound effects triggered by game events

## External Dependencies

### Frontend Dependencies

- **@react-three/fiber, @react-three/drei**: 3D rendering with Three.js
- **@radix-ui/*** components: UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: State management
- **@tanstack/react-query**: Data fetching and caching

### Backend Dependencies

- **Express**: Web server framework
- **Drizzle ORM**: Database access
- **@neondatabase/serverless**: PostgreSQL connectivity
- **connect-pg-simple**: Session management

## Deployment Strategy

The application is configured to be deployed on Replit with:

1. **Development Mode**
   - Uses `npm run dev` command to start development server
   - Hot module replacement enabled through Vite

2. **Production Build**
   - Frontend built with Vite
   - Backend bundled with esbuild
   - Static assets served from the `/dist/public` directory

3. **Database Provisioning**
   - Requires a PostgreSQL database (environment variable `DATABASE_URL`)
   - Schema migrations using Drizzle Kit

The application is designed to be easily deployable on Replit with support for cloud deployment through Replit's "deploymentTarget" configuration.