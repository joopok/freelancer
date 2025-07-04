# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
JobKorea Billboard (잡코리아 빌보드) - A modern freelancer matching platform connecting talented freelancers with companies. Built with Next.js 14 App Router, React 18, TypeScript, and Spring Boot backend. Features include 3D rotating carousel, glassmorphism effects, real-time search, and comprehensive project/freelancer management.

## Essential Commands

### Development & Build
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint checks
npm run analyze      # Bundle size analyzer (opens in browser)
```

### Code Quality & Testing
```bash
npm run depcheck              # Check for unused dependencies
npm run find-unused-files     # Find unused files with next-unused
npx tsc --noEmit             # TypeScript type checking
npm run tone:validate        # Validate tone and manner compliance
```

### Database Operations
```bash
npm run test:db              # Test database connection
npm run db:schema            # Apply database schema (requires MySQL password)
npm run db:update            # Update database structure
npm run db:categories        # Apply categories table updates
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 14.1.0 (App Router with Server Components)
- **UI Library**: React 18.2.0
- **Language**: TypeScript 5.3.3 (strict mode)
- **Styling**: Tailwind CSS 3.3.2 with dark mode
- **State Management**: Zustand 5.0.3 with persistence
- **Animations**: Framer Motion 12.19.2
- **HTTP Client**: Axios 1.8.3 with custom instance
- **Authentication**: JWT stored in localStorage
- **Database**: MariaDB 3.4.2
- **Backend**: Spring Boot (localhost:8080)

### Project Structure
```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable UI components
│   ├── common/      # Generic UI components
│   ├── layout/      # Layout components (Header, Footer)
│   ├── home/        # Homepage-specific components
│   ├── freelancer/  # Freelancer-related components
│   └── project/     # Project-related components
├── services/        # API service layer
├── store/           # Zustand state management
├── types/           # TypeScript type definitions
├── hooks/           # Custom React hooks
├── lib/             # Third-party library configs
├── utils/           # Utility functions
└── constants/       # Application constants
```

### API Integration Pattern
- All API calls MUST go through service layer (`/src/services/`)
- Backend API proxied via Next.js rewrites: `/api/*` → `http://localhost:8080/api/*`
- Custom hooks in `/src/hooks/` for data fetching (e.g., `useProjects`, `useFreelancers`)
- Mock data support via `NEXT_PUBLIC_USE_MOCK_API` environment variable
- Axios instance with interceptors for auth token injection

## Critical Development Rules

### TypeScript & Imports
1. **ALWAYS use `@/*` import paths** - Never use relative imports
2. **NO `any` types** - Define proper interfaces
3. **Maintain strict mode** - All TypeScript strict checks enabled
4. **Type coverage target**: ≥95%

### Component Development
1. **Server Components by default** - Only add `'use client'` when needed
2. **Dark mode required** - Use `dark:` prefix for all styles
3. **No custom CSS files** - Use Tailwind CSS exclusively
4. **Responsive design** - Mobile-first approach

### Code Quality
1. **Run lint before commit**: `npm run lint`
2. **Check types**: `npx tsc --noEmit`
3. **No console.log** in production code
4. **Use constants** for all hardcoded strings

## Database Configuration
- **Host**: 192.168.0.109
- **Port**: 3306
- **Database**: jobtracker
- **User**: root
- **Password**: ~Asy10131227 (in scripts)
- **MCP Server**: MariaDB MCP server in `mariadb-mcp-server/`

## Environment Variables
Required in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_TIMEOUT=30000
```

## Authentication Flow
- JWT tokens stored in localStorage as `auth_token`
- Token expiration: 24 hours
- Auth state managed by Zustand store with persistence
- Logout clears token and redirects to home

## Key Architectural Patterns

### Data Fetching with Custom Hooks
```typescript
// Example: useProjects hook pattern
const { projects, loading, error, totalCount, hasMore, refetch } = useProjects({
  page: 1,
  limit: 10,
  skills: ['React', 'TypeScript'],
  sortBy: 'latest'
});
```

### Component Composition
- Server Components by default for better performance
- Client Components only when interactivity needed (`'use client'`)
- Memoization with `React.memo` for expensive components
- Loading states with skeleton UI patterns

### State Management Pattern
```typescript
// Zustand store with persistence
interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}
```

### Error Handling Pattern
All API responses follow consistent structure:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
```

## Active Development Areas
1. **Skills API** - `/api/freelancers/skills/` integration
2. **Multi-search** - Tag-based filtering enhancement
3. **Dynamic routing** - Detail pages for freelancers/projects
4. **Settings page** - User preference management
5. **Test framework** - Jest/Vitest implementation needed

## Common Issues & Solutions

### CORS Errors
- Check Spring Boot is running on :8080
- Verify Next.js rewrites in `next.config.js`
- Ensure `allowedOriginPatterns` in backend

### Type Errors
- Use Result<T, E> pattern consistently
- Define interfaces in `/src/types/`
- Check imports use `@/*` paths

### Build Failures
- Run `npm run depcheck` for dependency issues
- Check environment variables exist
- Verify no relative imports used

## 🚨 CRITICAL: Project Loading Issues Prevention Guide

### Problem: "No matching projects found" displays immediately on page load

We've identified this recurring issue and created a systematic solution. Here's how to resolve it quickly and prevent future occurrences:

### Root Cause Analysis
1. **Mock API Mode Active** - When `NEXT_PUBLIC_USE_MOCK_API=true`, the app uses mock data instead of real backend
2. **Environment Variable Caching** - Next.js caches environment variables; changes require server restart
3. **Loading State Timing** - Brief moment between component mount and data fetch shows empty state

### Systematic Debugging Approach
When experiencing data loading issues, follow this proven checklist:

1. **Check Environment Variables FIRST**
   ```bash
   # Check current .env settings
   cat .env | grep NEXT_PUBLIC_USE_MOCK_API
   # Expected: NEXT_PUBLIC_USE_MOCK_API=false
   ```

2. **Verify Backend Status**
   ```bash
   # Test backend directly
   curl http://localhost:8080/api/projects?page=1&limit=10
   # Should return JSON with projects data
   ```

3. **Check Browser Console**
   - Look for: `🔍 useProjects - Mock API 사용: false`
   - Look for: `✅ Projects fetched:` with count > 0
   - Any error messages starting with `❌`

4. **Check Network Tab**
   - Filter by "XHR" or "Fetch"
   - Look for `/api/projects` request
   - Verify response status is 200
   - Check response contains actual data

### Essential Steps When Changing Environment Variables

**To ensure changes take effect, follow these steps when modifying .env:**

1. **Save .env file**
2. **Kill ALL Next.js processes**
   ```bash
   # Find processes
   ps aux | grep "next" | grep -v grep
   # Kill them (replace PID with actual process IDs)
   kill -9 [PID1] [PID2]
   ```
3. **Clear Next.js cache**
   ```bash
   rm -rf .next
   ```
4. **Restart server**
   ```bash
   npm run dev
   ```
5. **Verify in browser console** that environment variables are updated

### Environment Variable Best Practices

1. **Development Scripts**
   ```json
   // Add to package.json
   "scripts": {
     "dev:mock": "NEXT_PUBLIC_USE_MOCK_API=true npm run dev",
     "dev:api": "NEXT_PUBLIC_USE_MOCK_API=false npm run dev"
   }
   ```

2. **Visual Indicators**
   - ALWAYS check console logs for API mode
   - Consider adding visual indicator component for dev mode

3. **Pre-commit Verification**
   - NEVER commit with `NEXT_PUBLIC_USE_MOCK_API=true`
   - Add to pre-commit checklist

### Quick Resolution Steps
```bash
# When you see "No projects found" unexpectedly, try these steps:
1. pkill -f next     # Stop all Next.js processes
2. npm run dev:api   # Restart with real API mode
3. Hard refresh browser (Cmd+Shift+R)
```

### Prevention Measures
1. **Always use `dev:api` script for development**
2. **Check console logs immediately after page load**
3. **Verify backend is running BEFORE starting frontend**
4. **Document any environment changes in commit messages**

## 🎭 Tone and Manner Standards (from .cursor/rules/)

### Core Principles (MANDATORY)
1. **Respect First**: Acknowledge user effort, never assume knowledge level
2. **Clarity Above All**: Use active voice, specific words, logical structure
3. **Solution-Oriented**: Lead with what users CAN do, provide clear next steps

### User-Facing Text Rules
- **Error Messages Formula**: [Acknowledgment] + [Clear explanation] + [Specific action] + [Support offer]
- **Success Messages**: Celebrate achievement + Emphasize benefit + Suggest next step
- **Loading States**: Context-specific engaging messages (NOT generic "Loading...")
- **Empty States**: Helpful guidance with specific actions (NOT "No results found")

### Code Standards
- **Function Names**: Self-documenting, intention-revealing (e.g., `fetchAvailableFreelancers`, NOT `getData`)
- **Comments**: Explain WHY, not WHAT (Korean comments for complex logic)
- **Variable Names**: Clear and descriptive, no abbreviations

### Prohibited Patterns ❌
- Cold/technical language: "Operation failed", "HTTP 500", "Invalid input"
- Blaming users: "You entered invalid data", "Wrong input"
- Vague messages: "Something went wrong", "Error occurred", "Please wait"
- Generic buttons: "Submit", "OK", "Cancel"

### Tone Validation Commands
```bash
# Check for harsh language in UI components
npm run tone:check

# Validate error messages follow supportive formula
npm run tone:errors

# Check function naming clarity
npm run tone:naming

# Full tone compliance check
npm run tone:validate
```

### Example Implementations
```typescript
// ✅ CORRECT Error Message
const ERROR_MESSAGE = "We couldn't save your changes. Please check your internet connection and try again. Need help? Contact support@jobkorea.com";

// ❌ INCORRECT
const BAD_ERROR = "Save failed. Error 500.";

// ✅ CORRECT Loading Message
const LOADING_MESSAGE = "Finding perfect projects for your skills...";

// ❌ INCORRECT
const BAD_LOADING = "Loading...";
```

## Pre-commit Checklist
1. ✅ `npm run lint` - All errors fixed
2. ✅ `npx tsc --noEmit` - No type errors
3. ✅ `npm run tone:validate` - All tone checks passed
4. ✅ Dark mode appearance tested
5. ✅ API calls use service layer
6. ✅ Error handling follows supportive formula
7. ✅ Responsive on mobile/tablet/desktop
8. ✅ No console.log statements
9. ✅ All imports use @/* paths
10. ✅ Constants used (no hardcoded strings)
11. ✅ Component has TypeScript types
12. ✅ User-facing text is supportive and clear

## Backend Integration Notes
- Spring Boot backend must be running on port 8080
- Check `/Users/doseunghyeon/developerApp/JAVA/project_ai01` for backend
- Run backend with: `./gradlew bootRun`
- Backend CORS configured for localhost:3000

## 🎯 Priority Debugging Protocol

**When encountering empty or error states, follow this proven approach:**
1. **PAUSE** - Avoid modifying code immediately
2. **VERIFY** - Check environment variables in .env file
3. **TEST** - Confirm backend is running (use curl test)
4. **REFRESH** - Restart Next.js if environment variables changed
5. **INVESTIGATE** - Then examine code-related issues

**This systematic approach has successfully resolved all reported data loading issues.**

## Automated Tone Validation Scripts

The following npm scripts are available for validating tone and manner compliance:

```bash
# Check for harsh/blaming language in UI components
npm run tone:check

# Validate error messages follow supportive formula
npm run tone:errors

# Check function naming clarity
npm run tone:naming

# Run full tone compliance validation
npm run tone:validate
```

These scripts will help ensure all user-facing text follows our tone and manner guidelines before committing code.

## Cursor Rules Integration
The project includes comprehensive tone and manner protocols in `.cursor/rules/`:
- `project-tone-and-manner-protocol.mdc`: Detailed guidelines for all user-facing text
- `tone-and-manner-enforcement.mdc`: Automated validation and enforcement rules

These rules are marked with `alwaysApply: true` and must be followed in all development.

## Key Implementation Details

### Mock Data Support
The project supports mock data for development without backend:
```typescript
// In useProjects hook
const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';
if (useMockApi) {
  return createMockProjects(page, limit);
}
```

### Project Card Navigation
- Uses Next.js Link with `prefetch={true}` for smooth transitions
- Project detail page at `/project/[id]` with fadeIn animation
- No flickering between page transitions

### Performance Optimizations
- Debounced search (500ms) to reduce API calls
- Pagination with "Load More" pattern
- Memoized expensive computations
- Optimistic UI updates for better UX

*Last Updated: 2025-01-04*