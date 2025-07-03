# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
JobKorea Billboard - A modern freelancer matching platform built as a Next.js 14 SPA with React 18, TypeScript, Tailwind CSS, and Spring Boot backend integration.

## Essential Commands

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint checks

# Code Quality
npm run analyze      # Bundle size analyzer
npm run depcheck     # Check for unused dependencies
npx tsc --noEmit     # TypeScript type checking

# Database
npm run test:db      # Test database connection
npm run db:schema    # Apply database schema
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with dark mode
- **State**: Zustand + React Hooks
- **Animations**: Framer Motion
- **Auth**: JWT-based with localStorage
- **Database**: MariaDB (192.168.0.109:3306)
- **Backend**: Spring Boot (localhost:8080)

### Key Directories
```
src/
├── app/          # Next.js pages (App Router)
├── components/   # Reusable UI components
├── services/     # API service layer
├── store/        # Zustand state management
├── types/        # TypeScript definitions
└── hooks/        # Custom React hooks
```

### API Pattern
All API calls must go through the service layer in `src/services/`. The backend API is proxied through Next.js rewrites from `/api/*` to `http://localhost:8080/api/*`.

## Critical Development Rules

### MUST DO
1. **Use Server Components by default** - Add 'use client' only when needed
2. **Use @/* import paths** - Never use relative imports
3. **Tailwind CSS only** - No custom CSS files
4. **TypeScript strict mode** - No 'any' types, aim for ≥95% type coverage
5. **Result<T, E> pattern** for error handling
6. **Run lint before commit**: `npm run lint`
7. **Check types before commit**: `npx tsc --noEmit`

### MUST NOT DO
1. **Never commit without linting**
2. **Never use relative imports**
3. **Never create custom CSS files**
4. **Never use 'any' type**
5. **Never make direct API calls** - Use service layer

## Dark Mode Implementation
- Use `dark:` prefix for all dark mode styles
- Theme toggle available in Header component
- System preference detection enabled
- All new components must support dark mode

## Testing
**⚠️ NO TEST FRAMEWORK CONFIGURED** - Tests need to be implemented. Consider adding Jest/Vitest + React Testing Library.

## Environment Variables
Required in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_TIMEOUT=30000
```

## Pre-commit Checklist
1. Run `npm run lint` - all errors fixed
2. Run `npx tsc --noEmit` - no type errors
3. Test dark mode appearance
4. Verify API service layer usage
5. Check for proper error handling
6. Ensure responsive design works
7. No console.log statements
8. All imports use @/* paths
9. No hardcoded strings (use constants)
10. Component has proper TypeScript types

## Common Issues & Solutions

### Build Errors
- Run `npm run depcheck` to find dependency issues
- Check for missing environment variables
- Ensure all imports use @/* paths

### Type Errors
- Never use 'any' - define proper interfaces
- Use Result<T, E> for error handling
- Check strict mode compliance

### API Issues
- Verify Spring Boot backend is running on :8080
- Check CORS configuration
- Use service layer, not direct fetch

## Active Development Areas
- Skills API integration (`/api/freelancers/skills/`)
- Multi-search functionality with tag filtering
- Dynamic routing for detail pages
- Settings page enhancements