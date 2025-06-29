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
- Major refactoring: Cleaned up unused components and consolidated file structure
- Authentication stabilized after fixing JWT processing and auto-logout bugs  
- Theme system implemented with dark/light mode toggle and system detection
- Blog system expanded with 15+ specialized categories
- Dynamic routing added for detailed pages (athome/[id], freelancer/[id], project/[id])

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

### Project Structure Optimization
- Cleaned up unused components and CSS files
- Consolidated file structure and removed redundant code
- Added dynamic routing for athome, freelancer, and project detail pages