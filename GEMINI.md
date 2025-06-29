# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**JobKorea Billboard** is a modern freelancer matching platform that connects freelancers with projects. Built as a Single Page Application (SPA) using Next.js, React, and TypeScript, it provides an intuitive interface with various interactive elements for optimal user experience.

### Core Features
- **Interactive UI**: Modern design with animations for enhanced user experience
- **3D Rotating Carousel**: Visually effective display of featured projects in hero section
- **Glassmorphism Effects**: UI elements reflecting latest design trends
- **Authentication System**: User login and registration functionality
- **Search Functionality**: Project and freelancer search capabilities
- **Category Navigation**: Browse projects by various fields
- **Loading Animations**: Smooth loading states during page transitions
- **Internationalization**: Full Korean/English support with dynamic routing

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI/Styling**: Tailwind CSS
- **State Management**: Zustand + React Hooks
- **Animations**: Framer Motion
- **Authentication**: JWT-based with localStorage persistence
- **Internationalization**: next-intl

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

### Internationalization (i18n)
Uses `next-intl` with locale-based routing:

- **Dynamic Routing**: All routes under `src/app/[locale]/` with automatic locale detection
- **Supported Languages**: Korean (ko - default) and English (en)
- **Translation Loading**: Server-side message loading from `/messages/{locale}.json`
- **Middleware**: Automatic locale prefix injection for unlocalized routes
- **Component Usage**: `useTranslations` hook with namespaced translations

### State & Provider Architecture
Provider hierarchy in `src/app/[locale]/layout.tsx`:
```
NextIntlClientProvider (i18n context)
  └── LoadingProvider (global loading states)
      └── StateProvider (app-wide state management)
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
- Major refactoring: Many pages deleted and moved to `[locale]` structure
- Authentication stabilized after fixing JWT processing and auto-logout bugs
- i18n infrastructure ready but only Header component has translations
- Main page simplified after removing complex home components

### API Configuration
- Backend API proxy: `http://localhost:8081`
- CORS handled via Next.js rewrites in `next.config.js`
- JWT tokens stored in localStorage with 30-day expiry

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

## Project Structure

### Core Application Structure
```
src/
├── app/
│   ├── [locale]/              # Internationalized routes
│   │   ├── about/            # About page
│   │   ├── blog/             # Blog section with multiple categories
│   │   │   ├── posts/        # Individual blog posts
│   │   │   └── [categories]  # Various blog categories
│   │   ├── community/        # Community features (board, QnA, gallery)
│   │   ├── jobs/             # Job listings
│   │   ├── freelancer/       # Freelancer section
│   │   ├── login/            # Authentication pages
│   │   └── register/
│   ├── api/                  # API routes
│   │   └── auth/            # Authentication endpoints
│   └── styles/              # Global styles (minimal use)
├── components/
│   ├── auth/                # Authentication components
│   ├── blog/                # Blog-specific components
│   ├── common/              # Shared components
│   ├── job/                 # Job-related components
│   ├── layout/              # Layout components (Header, Footer, etc.)
│   └── providers/           # Context providers
├── services/                # API service layer
│   ├── auth.ts             # Authentication services
│   └── techNewsService.ts  # Tech news API calls
├── store/                   # State management
│   └── auth.ts             # Authentication store (Zustand)
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript type definitions
├── utils/                   # Utility functions
│   ├── jwt.ts              # JWT token handling
│   ├── session.ts          # Session management
│   └── api.ts              # API client configuration
└── i18n.ts                 # Internationalization config
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

### Key Feature Areas
1. **Blog System**: Multi-category blog with posts, AI columns, tech news, and Silicon Valley insights
2. **Community Platform**: Discussion boards, Q&A, project reviews, study groups
3. **Career Services**: Job listings, freelancer marketplace, resume builder
4. **Authentication**: Complete auth flow with JWT tokens and session management
5. **Internationalization**: Full Korean/English support with dynamic routing

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
Add to `.env.local`:
```
NEXT_PUBLIC_USE_MOCK_API=true
```

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

### Hero Section Improvements
- Implemented 3D rotating carousel with 5 project cards
- Added rotation effects, depth perception, and gradient effects
- Automatic rotation with user control functionality

### Category Section Enhancements
- Modern design with interactive elements
- Added glassmorphism effects
- 3D effects and animations on hover
- Category-specific icons
- "View All" button functionality

### Authentication & Page Transitions
- Conditional rendering based on login status
- LocalStorage-based simple authentication state management
- Loading state management during page transitions
- Loading component activation on menu link clicks