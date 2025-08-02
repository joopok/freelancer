# GEMINI.md

This file provides guidance to the Gemini CLI when working with code in this repository.

## Project Overview

**JobKorea Billboard** is a modern freelancer matching platform built as a Single Page Application (SPA) using Next.js, React, and TypeScript. It features an interactive UI, authentication, search, multi-category blog, community platform, and dark/light theme support.

## Essential Commands

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)
npm run dev:api      # Start with real API (NEXT_PUBLIC_USE_MOCK_API=false)
npm run dev:mock     # Start with mock data (NEXT_PUBLIC_USE_MOCK_API=true)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint checks

# Code Quality & Analysis
npm run analyze      # Analyze bundle size (ANALYZE=true npm run build)
npm run depcheck     # Check for unused dependencies
npm run find-unused-files  # Find unused files

# Testing
# Note: No test framework is currently configured. Consider adding Jest/Vitest for unit tests.

# Database Operations
npm run test:db      # Test database connection to MariaDB
npm run db:schema    # Apply database schema
npm run db:categories # Apply categories table updates

# TypeScript Checks
npx tsc --noEmit     # Type checking without emitting files
npx type-coverage --detail --strict --at-least 95  # Check type coverage

# Tone and Manner Validation
npm run tone:check     # Check for harsh language in UI text
npm run tone:errors    # Validate error messages are supportive
npm run tone:naming    # Check function naming conventions
npm run tone:validate  # Run all tone checks
```

## High-Level Architecture

- **Tech Stack**:
  - **Framework**: Next.js 14.1.0 (App Router with Server Components)
  - **UI Library**: React 18.2.0
  - **Language**: TypeScript 5.3.3 (strict mode)
  - **Styling**: Tailwind CSS 3.3.2 with dark mode
  - **State Management**: Zustand 5.0.3 with persistence
  - **Animations**: Framer Motion 12.19.2
  - **HTTP Client**: Axios 1.8.3 with custom instance
  - **Real-time**: Socket.io-client 4.8.1 for WebSocket
  - **Authentication**: JWT stored in localStorage
  - **Database**: MariaDB 3.4.2
  - **Backend**: Spring Boot (localhost:8080) + Socket.io (localhost:9092)
- **API Layer Pattern**: All API calls go through `src/services/` using Axios with interceptors for token management and centralized error handling. Backend API is proxied via Next.js rewrites: `/api/*` → `http://localhost:8080/api/*`.
- **Authentication System**: JWT-based with localStorage persistence, Zustand store, API service, and Next.js middleware for session validation.
- **Theme Management System**: Dark/light theme with Zustand store, animated toggle, localStorage persistence, and Tailwind integration.


## Critical Development Rules

### MUST DO:
1.  **Server Components First**: Default to RSC. Only use 'use client' when browser APIs are required.
2.  **Use Path Aliases**: Always import with `@/*` (e.g., `import { Button } from '@/components/ui/Button'`).
3.  **Tailwind CSS Only**: Style exclusively with Tailwind utilities and `clsx` for conditionals.
4.  **Centralize API Calls**: All external API calls must go through `src/services/`.
5.  **Type Everything**: Shared types go in `src/types/`, use TypeScript strictly.
6.  **Result Types**: Use `Result<T, E>` pattern for all error-prone operations.
7.  **Runtime Validation**: Validate all external data with Zod schemas or type guards.
8.  **Named Exports**: Prefer named exports over default exports for components.

### MUST NOT DO:
1.  **Never abuse 'use client'**: Don't add it unless you need useState, useEffect, or event handlers.
2.  **No custom CSS files**: Never create .css or .module.css files.
3.  **No direct API calls in components**: Always use the service layer.
4.  **No relative imports**: Never use `../../../` paths.
5.  **No 'any' types**: Zero tolerance for 'any' in production code.
6.  **No uncaught exceptions**: All errors must be handled gracefully.

## 🎭 Tone and Manner Standards (MANDATORY)

### Core Principles
1.  **Respect First**: Acknowledge user effort, never assume knowledge level.
2.  **Clarity Above All**: Use active voice, specific words, logical structure.
3.  **Solution-Oriented**: Lead with what users CAN do, provide clear next steps.

### User-Facing Text Rules
- **Error Messages Formula**: [Acknowledgment] + [Clear explanation] + [Specific action] + [Support offer]
- **Success Messages**: Celebrate achievement + Emphasize benefit + Suggest next step
- **Loading States**: Context-specific engaging messages (NOT generic "Loading...")
- **Empty States**: Helpful guidance with specific actions (NOT "No results found")

### Enforcement
- All error messages must use `// TONE: OK` comment if they contain Error/Failed/Invalid/Wrong.
- Run `npm run tone:validate` before committing.

## Important Context

### Recent Project State & Major Features
- **Remote Project Full Implementation**: Complete API integration for `/athome/*` pages via `remoteProjectService`.
- **Enhanced Freelancer Filtering**: Advanced filters (rate, experience, etc.) and sorting with URL state sync.
- **Common UI Components**: Reusable `BookmarkButton`, `ApplyModal`, `InquiryModal`, `OptimizedImage`, `VirtualList`.
- **Real-time Notifications**: WebSocket integration is complete.
- **Active Development**: AI-powered recommendations, performance optimizations, and SEO enhancements.

### API Configuration
- **Backend Integration**: Spring Boot server at `http://localhost:8080`.
- **Proxy Configuration**: Next.js rewrites `/api/*` → `http://localhost:8080/api/*`.
- **Authentication**: JWT tokens stored in localStorage with 24-hour expiry.

### Database Connection
- **Host**: 192.168.0.109:3306
- **Database**: jobtracker
- **User**: root
- **Password**: ~Asy10131227
- **Schema**: `JobKoreaBillboard`

### Development Workflow
1.  Check if component should be client or server (default to server).
2.  Use existing patterns from similar components.
3.  Ensure all API calls go through service layer.
4.  Add types to `src/types/` if used in multiple places.
5.  Follow Tailwind-only styling with design tokens from `tailwind.config.js`.

### TypeScript Safety Requirements
- **Type Coverage**: Maintain ≥ 95% type coverage.
- **No 'any' Usage**: Zero 'any' types allowed.
- **Runtime Validation**: Use Zod schemas and type guards for all external data.
- **Error Handling**: Use `Result<T, E>` pattern.

### Dark Mode Implementation Protocol
- **CSS Foundation**: All components must have dark mode variants using `dark:` prefix.
- **State Synchronization**: Theme changes must update both Zustand store AND DOM classList.

## Project Structure

```
src/
├── app/                 # Internationalized routes
├── components/          # Reusable UI components
├── services/            # API service layer
├── store/               # State management (Zustand)
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Backend Integration Guide

- **Spring Boot Connection**: Integrates with a Java Spring Boot backend.
- **Backend Path**: `/Users/doseunghyeon/developerApp/JAVA/project_ai01`
- **Run Backend**: `cd /Users/doseunghyeon/developerApp/JAVA/project_ai01 && ./gradlew bootRun`
- **API Proxy Configuration**: Next.js rewrites `/api/*` to `http://localhost:8080/api/*`.
- **CORS Requirements**: Spring Boot `WebConfig.java` should allow `http://localhost:3000`.

## Real-time WebSocket Integration
- **Client-side**: `useRealtimeStats` hook and `WebSocketProvider` manage the connection. Auto-reconnect is implemented.
- **Server-side**: Socket.io server on port 9092.
- **Events**: `join_project`, `leave_project`, `realtime_update`, etc. for stats like viewer count, application count.

## Pre-commit Checklist

Before committing code, ensure:
1.  **Build passes**: `npm run build` (zero errors)
2.  **Lint passes**: `npm run lint` (zero warnings)
3.  **Type check passes**: `npx tsc --noEmit`
4.  **Type coverage**: `npx type-coverage --detail --strict --at-least 95`
5.  **Tone check passes**: `npm run tone:validate`
6.  **Dark mode implemented**: All new components have dark variants.
7.  **Accessibility**: All interactive elements have proper ARIA labels.
8.  **Runtime validation**: All API endpoints have proper validation.

## Common Issues & Solutions

### Project Loading Issues
If "No matching projects found" appears unexpectedly:
1.  `pkill -f next`
2.  `npm run dev:api`
3.  Hard refresh browser (Cmd+Shift+R)

### JSON String Parsing in API Responses
```typescript
if (typeof processedProject.requiredSkills === 'string') {
  try {
    const parsed = JSON.parse(processedProject.requiredSkills);
    if (Array.isArray(parsed)) {
      processedProject.requiredSkills = parsed;
    }
  } catch (e) {
    console.warn('Failed to parse requiredSkills:', e);
    processedProject.requiredSkills = [];
  }
}
```
