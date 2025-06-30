# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**JobKorea Billboard** is a modern freelancer matching platform that connects freelancers with projects. Built as a Single Page Application (SPA) using Next.js, React, and TypeScript, it provides an intuitive interface with various interactive elements for optimal user experience.

### Core Features
- **Interactive UI**: Modern design with animations for enhanced user experience
- **Dark/Light Theme**: System theme detection with manual toggle and localStorage persistence
- **Authentication System**: JWT-based user login and registration with session management
- **Search Functionality**: Project and freelancer search capabilities
- **Multi-Category Blog**: Extensive blog system with 15+ specialized categories
- **Community Platform**: Discussion boards, Q&A, project reviews, study groups
- **Loading Animations**: Smooth loading states during page transitions
- **Dynamic Routing**: Project, freelancer, and content detail pages with [id] routing

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI/Styling**: Tailwind CSS with dark mode support
- **State Management**: Zustand + React Hooks
- **Animations**: Framer Motion
- **Authentication**: JWT-based with localStorage persistence
- **Theme Management**: System-aware dark/light mode with manual toggle

## Essential Commands

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint checks

# Code Quality & Analysis
npm run analyze      # Analyze bundle size (ANALYZE=true next build)
npm run depcheck     # Check for unused dependencies
npm run find-unused-files  # Find unused files in the project

# Testing
# Note: No test framework is currently configured. Consider adding Jest/Vitest for unit tests.

# Database Operations
npm run test:db      # Test database connection to MariaDB
npm run db:schema    # Apply database schema (requires MariaDB running on 192.168.0.109:3306)

# TypeScript Checks
npx tsc --noEmit     # Type checking without emitting files
```

## High-Level Architecture

### Authentication System
The authentication flow involves multiple interconnected layers:

1. **JWT Token Management** (`src/utils/jwt.ts`): Custom JWT implementation with manual Base64URL decoding fallback
2. **Session Layer** (`src/utils/session.ts`): Server-side in-memory session storage with UUID-based IDs and 30-day expiry
3. **State Management** (`src/store/auth.ts`): Zustand store with localStorage persistence for client-side auth state
4. **API Service** (`src/services/auth.ts`): Centralized authentication API calls with comprehensive error handling
5. **Middleware Protection**: Session validation in Next.js middleware

The system handles the "auto-logout bug" through multi-step validation and state synchronization between client and server.

### Theme Management System
Comprehensive dark/light theme implementation:

- **Theme Store** (`src/store/theme.ts`): Zustand store with system theme detection
- **Theme Toggle** (`src/components/common/ThemeToggle.tsx`): Animated toggle component with sun/moon icons
- **Persistence**: localStorage with 'theme' key and system preference fallback
- **Tailwind Integration**: Full dark mode support across all components
- **System Detection**: Automatic theme detection based on user's system preferences

### State & Provider Architecture
Provider hierarchy in `src/app/layout.tsx`:
```
LoadingProvider (global loading states)
  └── Page Components (with individual theme and auth state management)
```

### API Layer Pattern
- All API calls go through `src/services/` layer
- Axios instance with request/response interceptors for token management
- Protected routes pattern with automatic token attachment
- Centralized error handling with user-friendly messages

## Critical Development Rules

### MUST DO:
1. **Server Components First**: Default to RSC. Only use 'use client' when browser APIs are required
2. **Use Path Aliases**: Always import with `@/*` (e.g., `import { Button } from '@/components/ui/Button'`)
3. **Tailwind CSS Only**: Style exclusively with Tailwind utilities and `clsx` for conditionals
4. **Centralize API Calls**: All external API calls must go through `src/services/`
5. **Type Everything**: Shared types go in `src/types/`, use TypeScript strictly

### MUST NOT DO:
1. **Never abuse 'use client'**: Don't add it unless you need useState, useEffect, or event handlers
2. **No custom CSS files**: Never create .css or .module.css files
3. **No direct API calls in components**: Always use the service layer
4. **No relative imports**: Never use `../../../` paths

## Important Context

### Recent Project State
- **Authentication System**: Complete JWT-based flow with Spring Boot backend integration
- **Login Experience**: Spinner feedback and smooth navigation to main page on success
- **Backend Integration**: Connected to Java Spring Boot server with MyBatis ORM
- **Database Schema**: Synchronized frontend/backend field mappings for user authentication
- **Theme System**: Dark/light mode with system detection and localStorage persistence
- **Architecture**: Cleaned up unused components, consolidated file structure
- **Dynamic Routing**: Added for detailed pages (athome/[id], freelancer/[id], project/[id])

### API Configuration
- **Backend Integration**: Spring Boot server at `http://localhost:8080`
- **Proxy Configuration**: Next.js rewrites `/api/*` → `http://localhost:8080/api/*` 
- **Authentication**: JWT tokens stored in localStorage with 30-day expiry
- **Environment Variables**: Managed through `src/utils/env.ts` with defaults
  - API URL: `http://localhost:8080` (configurable via `NEXT_PUBLIC_API_URL`)
  - Mock API: Disabled by default (`NEXT_PUBLIC_USE_MOCK_API=false`)
  - API Timeout: 30 seconds (`NEXT_PUBLIC_API_TIMEOUT=30000`)
  - Cache Time: 5 minutes (`NEXT_PUBLIC_API_CACHE_TIME=300000`)
  - Auth Token: `auth_token` (`NEXT_PUBLIC_AUTH_TOKEN_NAME`)

### Database Connection
- **Database**: MariaDB running on `192.168.0.109:3306`
- **Schema**: `JobKoreaBillboard` 
- **Connection Testing**: `npm run test:db`
- **Schema Management**: SQL files in `database/` directory

### Performance Considerations
- Bundle analyzer available for optimization insights
- Webpack configured for vendor chunk splitting
- Image optimization enabled with Next.js Image component
- Memory-efficient session management with 1000 session limit

### Development Workflow
When modifying the codebase:
1. Check if component should be client or server (default to server)
2. Use existing patterns from similar components
3. Ensure all API calls go through service layer
4. Add types to `src/types/` if used in multiple places
5. Follow Tailwind-only styling with design tokens from `tailwind.config.js`

### TypeScript Safety Requirements
- **Type Coverage**: Maintain ≥ 95% type coverage
- **No 'any' Usage**: Zero 'any' types allowed in production code
- **Runtime Validation**: Use type guards for all external data (API responses, user input)
- **Error Handling**: Use Result<T, E> pattern instead of throwing exceptions

### Dark Mode Implementation Protocol
- **CSS Foundation**: All components must have dark mode variants using `dark:` prefix
- **State Synchronization**: Theme changes must update both Zustand store AND DOM classList
- **Systematic Coverage**: Every component must include dark variants for:
  - Backgrounds: `bg-white dark:bg-gray-900`
  - Text: `text-gray-900 dark:text-gray-100`
  - Borders: `border-gray-200 dark:border-gray-700`
  - Shadows: `shadow-lg dark:shadow-white/5`

## Project Structure

### Core Application Structure
```
src/
├── app/
│   ├── athome/               # At-home work opportunities
│   │   └── [id]/            # Dynamic detail pages
│   ├── blog/                # Blog section with 15+ categories
│   │   ├── posts/           # Individual blog posts
│   │   ├── ai-column/       # AI-focused content
│   │   ├── silicon-valley/  # Silicon Valley insights
│   │   ├── tech-news/       # Technology news
│   │   ├── balance-up/      # Work-life balance content
│   │   ├── design-tech/     # Design technology
│   │   ├── hr-tech/         # HR technology
│   │   └── [8+ more categories]
│   ├── community/           # Community features (board, QnA, gallery)
│   ├── freelancer/          # Freelancer section
│   │   └── [id]/           # Dynamic freelancer profiles
│   ├── jobs/                # Job listings
│   ├── login/               # Authentication pages
│   ├── membership/          # Membership features
│   ├── project/             # Project section
│   │   └── [id]/           # Dynamic project details
│   ├── register/            # User registration
│   ├── resume/              # Resume builder
│   ├── terms/               # Terms and conditions
│   ├── api/                 # API routes
│   │   └── auth/           # Authentication endpoints
│   └── styles/             # Global styles (minimal use)
├── components/
│   ├── blog/                # Blog-specific components
│   ├── common/              # Shared components (including ThemeToggle)
│   ├── job/                 # Job-related components
│   ├── layout/              # Layout components (Header, Bottom, StateProvider)
│   └── providers/           # Context providers
├── services/                # API service layer
│   ├── auth.ts             # Authentication services
│   └── techNewsService.ts  # Tech news API calls
├── store/                   # State management
│   ├── auth.ts             # Authentication store (Zustand)
│   └── theme.ts            # Theme management store (Zustand)
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript type definitions
├── utils/                   # Utility functions
│   ├── jwt.ts              # JWT token handling
│   ├── session.ts          # Session management
│   └── api.ts              # API client configuration
├── hooks/                   # Custom React hooks (including useScrollAnimation)
├── types/                   # TypeScript type definitions
│   ├── athome.ts           # At-home work types
│   ├── freelancer.ts       # Freelancer types
│   └── project.ts          # Project types
└── middleware.ts           # Next.js middleware for security headers
```

### Public Assets
```
public/
└── images/
    ├── blog/               # Blog-related images
    │   └── categories/     # Category thumbnails
    ├── icons/              # SVG icons
    └── [social-icons]      # Social media icons
```

### Database Structure
```
database/
├── DDL/                    # Table creation scripts
├── DML/                    # Data insertion scripts
├── DCL/                    # Permission scripts
├── ERD/                    # Entity Relationship Diagrams
└── schema.sql             # Complete database schema
```

### Key Feature Areas
1. **Blog System**: 15+ specialized categories including AI columns, tech news, Silicon Valley insights, balance-up, design-tech, hr-tech, logistics-tech, manufacturing-tech, marketing-tech, purchase-tech, and strategy-tech
2. **Community Platform**: Discussion boards, Q&A, project reviews, study groups, and gallery
3. **Career Services**: Job listings, freelancer marketplace, resume builder, and at-home work opportunities
4. **Authentication**: Complete JWT-based auth flow with session management and auto-logout protection
5. **Theme System**: Comprehensive dark/light mode with system detection and manual toggle

## Installation and Setup

```bash
# Clone the repository
git clone [repository URL]

# Navigate to project directory
cd aiproject02

# Install dependencies
npm install

# Start development server
npm run dev
```

Development server runs on http://localhost:3000 by default.

### Environment Configuration
Required environment variables (create `.env.local`):
```env
# API Configuration  
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_API_CACHE_TIME=300000
NEXT_PUBLIC_AUTH_TOKEN_NAME=auth_token
NEXT_PUBLIC_AUTH_REFRESH_TOKEN_NAME=refresh_token
NODE_ENV=development

# Database Configuration (for backend integration)
DB_HOST=192.168.0.109
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=JobKoreaBillboard

# JWT Configuration (backend)
JWT_SECRET=jobkorea-billboard-secret-key-2024
JWT_EXPIRY=30d
```

**Note**: All `NEXT_PUBLIC_*` variables are exposed to the browser. Server-only variables (DB credentials, JWT secrets) should not use the `NEXT_PUBLIC_` prefix.

## Key Implementation Patterns

### Authentication State Management
```typescript
// Simple authentication state check using localStorage
useEffect(() => {
  const token = localStorage.getItem('auth_token');
  setIsLoggedIn(!!token);
}, []);
```

### 3D Rotating Carousel Implementation
```typescript
// Calculate position and rotation for each card in 3D space
const isActive = index === activeCardIndex;
const isPrev = index === (activeCardIndex === 0 ? heroProjects.length - 1 : activeCardIndex - 1);
// ... position and transform calculation logic ...
```

### Page Navigation with Loading States
```typescript
const navigateTo = (href: string) => {
  setLoading(true);
  window.location.href = href;
  
  setTimeout(() => {
    setLoading(false);
  }, 1000);
};
```

## Recent Feature Updates

### Theme System Implementation
- Added comprehensive dark/light mode support with `src/store/theme.ts`
- Implemented animated theme toggle component with sun/moon icons
- System theme detection with localStorage persistence
- Full Tailwind dark mode integration across all components

### Blog System Expansion
- Added 15+ specialized blog categories covering various tech domains
- Implemented dynamic routing for detailed blog posts
- Enhanced blog navigation and categorization

### Authentication & Page Transitions
- Stabilized JWT processing and fixed auto-logout bugs
- Enhanced session management with UUID-based IDs
- Loading state management during page transitions
- Conditional rendering based on authentication status

### Multi-Search Functionality
- Implemented advanced multi-search input component (`MultiSearchInput.tsx`)
- Tag-based search system with Enter to add, X to remove functionality
- Integrated across freelancer, on-site project, and remote project pages
- AND condition search logic for enhanced filtering accuracy

### Sorting & Filtering Systems
- Added comprehensive sorting options: rating, experience, view count, duration, budget
- Implemented clickable sort buttons with visual state indicators
- Fixed data parsing issues (e.g., "3개월" duration parsing)
- Unified sorting behavior across all project and freelancer pages

### Performance & Code Quality
- Unified loading indicator colors across pages (`border-blue-600 dark:border-blue-400`)
- Git-based file restoration for corrupted files during development
- Memory and performance optimizations with webpack chunk splitting
- Bundle analysis tools for optimization insights

### Project Structure Optimization
- Cleaned up unused components and CSS files
- Consolidated file structure and removed redundant code
- Added dynamic routing for athome, freelancer, and project detail pages

## Data Parsing Patterns

### Duration Field Handling
```typescript
// Parse Korean duration strings (e.g., "3개월")
const durationA = parseInt(a.duration.replace(/[^0-9]/g, ''));
const durationB = parseInt(b.duration.replace(/[^0-9]/g, ''));
return durationB - durationA; // Descending order
```

### Experience Level Filtering
```typescript
// Experience filtering with years extraction
const yearsExp = parseInt(freelancer.experience);
const matchesExperience = selectedExperience === '' ||
  (selectedExperience === '3' && yearsExp <= 3) ||
  (selectedExperience === '6' && yearsExp <= 6) ||
  // ... additional conditions
```

## File Restoration & Development Safety

### Git-Based Recovery
```bash
# Restore corrupted files during development
git checkout HEAD -- [filename]
```

### Common File Corruption Scenarios
- TypeScript files with 800+ errors after edit operations
- Files affected: `athome/page.tsx`, `freelancer/page.tsx`
- Recovery pattern: Git restore → Re-apply changes incrementally

## Pre-commit Checklist

Before committing code, ensure:
1. **Build passes**: `npm run build` (zero errors)
2. **Lint passes**: `npm run lint` (zero warnings)
3. **Type check passes**: `npx tsc --noEmit`
4. **Bundle size check**: `npm run analyze` (if significant changes)
5. **Unused dependencies**: `npm run depcheck`
6. **Dark mode implemented**: All new components have dark variants
7. **Accessibility**: All interactive elements have proper ARIA labels

## Backend Integration Guide

### Spring Boot Connection
The application integrates with a Java Spring Boot backend. Critical integration points:

1. **API Proxy Configuration** (already configured in `next.config.js`):
   ```javascript
   // Next.js rewrites:
   '/api/:path*' → 'http://localhost:8080/api/:path*'
   ```

2. **Authentication Flow**:
   - **Login**: `POST /api/auth/login` → Spring Boot `/api/auth/login`
   - **Session Check**: `GET /api/auth/session` → Spring Boot `/api/auth/session-info`
   - **Logout**: `POST /api/auth/logout` → Spring Boot `/api/auth/logout`

3. **Request/Response Formats**:
   ```typescript
   // Login Request
   { username: string, password: string }
   
   // Login Response
   { success: boolean, token: string, user: User, error?: string }
   
   // Session Response  
   { success: boolean, data: { id, username, email, role }, message?: string }
   ```

4. **Database Schema Synchronization**:
   - Frontend expects: `{ password, name, username, email, role }`
   - Backend model should match these field names
   - Use MyBatis XML mappers for field name translation if needed

5. **CORS Requirements** (Spring Boot `WebConfig.java`):
   ```java
   @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
   ```

## Component Development Standards

### Mandatory Component Props
All interactive components must include:
```typescript
interface ComponentProps {
  className?: string;          // For style extension
  'aria-label'?: string;       // Accessibility
  disabled?: boolean;          // Disabled state
  loading?: boolean;           // Loading state
  // Component-specific props...
}
```

### State Management Pattern
Use discriminated unions for component states:
```typescript
type AsyncState<T> = 
  | { status: 'idle' }
  | { status: 'loading'; progress?: number }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string; retryable: boolean }
```

### Performance Requirements
- Components with >100 items: Use virtualization
- Bundle size >50KB: Use dynamic imports
- Memoize expensive computations (>16ms)
- Meet Core Web Vitals targets:
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1