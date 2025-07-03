# GEMINI.md

This file provides guidance to the Gemini CLI when working with code in this repository.

## Project Overview

**JobKorea Billboard** is a modern freelancer matching platform built as a Single Page Application (SPA) using Next.js, React, and TypeScript. It features an interactive UI, authentication, search, multi-category blog, community platform, and dark/light theme support.

## Essential Commands

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint checks

# Code Quality & Analysis
npm run analyze      # Analyze bundle size
npm run depcheck     # Check for unused dependencies
npm run find-unused-files  # Find unused files

# Testing
# Note: No test framework is currently configured. Consider adding Jest/Vitest for unit tests.

# Database Operations
npm run test:db      # Test database connection to MariaDB
npm run db:schema    # Apply database schema

# TypeScript Checks
npx tsc --noEmit     # Type checking without emitting files
npx type-coverage --detail --strict --at-least 95  # Check type coverage
```

## High-Level Architecture

- **Authentication System**: JWT-based with localStorage persistence, Zustand store, API service, and Next.js middleware for session validation.
- **Theme Management System**: Dark/light theme with Zustand store, animated toggle, localStorage persistence, and Tailwind integration.
- **API Layer Pattern**: All API calls go through `src/services/` using Axios with interceptors for token management and centralized error handling.

## Critical Development Rules

### MUST DO:
1. **Server Components First**: Default to RSC. Only use 'use client' when browser APIs are required.
2. **Use Path Aliases**: Always import with `@/*` (e.g., `import { Button } from '@/components/ui/Button'`).
3. **Tailwind CSS Only**: Style exclusively with Tailwind utilities and `clsx` for conditionals.
4. **Centralize API Calls**: All external API calls must go through `src/services/`.
5. **Type Everything**: Shared types go in `src/types/`, use TypeScript strictly.
6. **Result Types**: Use `Result<T, E>` pattern for all error-prone operations.
7. **Runtime Validation**: Validate all external data with Zod schemas or type guards.
8. **Named Exports**: Prefer named exports over default exports for components.

### MUST NOT DO:
1. **Never abuse 'use client'**: Don't add it unless you need useState, useEffect, or event handlers.
2. **No custom CSS files**: Never create .css or .module.css files.
3. **No direct API calls in components**: Always use the service layer.
4. **No relative imports**: Never use `../../../` paths.
5. **No 'any' types**: Zero tolerance for 'any' in production code.
6. **No uncaught exceptions**: All errors must be handled gracefully.

## Important Context

### Recent Project State
- Complete JWT-based authentication with Spring Boot backend integration.
- Dark/light mode with system detection and localStorage persistence.
- Dynamic routing for detailed pages (athome/[id], freelancer/[id], project/[id]).
- Active development on freelancer page improvements and skills API integration.

### API Configuration
- Backend Integration: Spring Boot server at `http://localhost:8080`.
- Proxy Configuration: Next.js rewrites `/api/*` → `http://localhost:8080/api/*`.
- Authentication: JWT tokens stored in localStorage with 30-day expiry.

### Database Connection
- Database: MariaDB running on `192.168.0.109:3306`.
- Schema: `JobKoreaBillboard`.

### Development Workflow
When modifying the codebase:
1. Check if component should be client or server (default to server).
2. Use existing patterns from similar components.
3. Ensure all API calls go through service layer.
4. Add types to `src/types/` if used in multiple places.
5. Follow Tailwind-only styling with design tokens from `tailwind.config.js`.

### TypeScript Safety Requirements
- Type Coverage: Maintain ≥ 95% type coverage.
- No 'any' Usage: Zero 'any' types allowed.
- Runtime Validation: Use Zod schemas and type guards for all external data.
- Error Handling: Use `Result<T, E>` pattern.

### Dark Mode Implementation Protocol
- CSS Foundation: All components must have dark mode variants using `dark:` prefix.
- State Synchronization: Theme changes must update both Zustand store AND DOM classList.

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

## Key Implementation Patterns

- **Authentication State Management**: Simple check using localStorage.
- **3D Rotating Carousel**: Logic for calculating position and rotation.
- **Page Navigation with Loading States**: Setting loading state during navigation.

## Pre-commit Checklist

Before committing code, ensure:
1. **Build passes**: `npm run build` (zero errors)
2. **Lint passes**: `npm run lint` (zero warnings)
3. **Type check passes**: `npx tsc --noEmit`
4. **Type coverage**: `npx type-coverage --detail --strict --at-least 95`
5. **Dark mode implemented**: All new components have dark variants.
6. **Accessibility**: All interactive elements have proper ARIA labels.
7. **Runtime validation**: All API endpoints have proper validation.
8. **Error handling**: All async operations use `Result<T, E>` pattern.

## Backend Integration Guide

- **Spring Boot Connection**: Integrates with a Java Spring Boot backend.
- **API Proxy Configuration**: Next.js rewrites `/api/*` to `http://localhost:8080/api/*`.
- **Authentication Flow**: Standard login, session check, and logout endpoints.
- **Database Schema Synchronization**: Frontend and backend field mappings should match.
- **CORS Requirements**: Spring Boot `WebConfig.java` should allow `http://localhost:3000`.

## Component Development Standards

- **Mandatory Component Props**: All interactive components must include `className`, `aria-label`, `disabled`, and `loading` props.
- **Advanced Type Patterns (Required)**: Use `Result<T, E>` for error handling, branded types for domain identifiers, and discriminated unions for state management.
- **State Management Pattern**: Use discriminated unions for component states.
- **Performance Requirements**: Use virtualization for large lists, dynamic imports for large bundles, and memoize expensive computations.
