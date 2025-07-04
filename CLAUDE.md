# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
JobKorea Billboard (잡코리아 빌보드) - A modern freelancer matching platform connecting talented freelancers with companies. Built with Next.js 14 App Router, React 18, TypeScript, and Spring Boot backend. Features include 3D rotating carousel, glassmorphism effects, real-time search, and comprehensive project/freelancer management.

## Essential Commands

### Development & Build
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run dev:api      # Start with real API (NEXT_PUBLIC_USE_MOCK_API=false)
npm run dev:mock     # Start with mock data (NEXT_PUBLIC_USE_MOCK_API=true)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint checks
npm run analyze      # Bundle size analyzer (ANALYZE=true npm run build)
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
3. **No console.log** in production code (except for debugging with clear prefixes like 🔍, ✅, ❌)
4. **Use constants** for all hardcoded strings

## Database Configuration
- **Host**: 192.168.0.109
- **Port**: 3306
- **Database**: jobtracker
- **User**: root
- **Password**: ~Asy10131227 (in scripts)
- **MCP Server**: MariaDB MCP server in `mariadb-mcp-server/`

## Environment Variables
Required in `.env` or `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_AUTH_TOKEN_NAME=auth_token
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

## 🚨 CRITICAL: Project Loading Issues Prevention Guide

### Problem: "No matching projects found" displays immediately on page load

### Root Cause Analysis
1. **Mock API Mode Active** - When `NEXT_PUBLIC_USE_MOCK_API=true`, the app uses mock data instead of real backend
2. **Environment Variable Caching** - Next.js caches environment variables; changes require server restart
3. **Loading State Timing** - Brief moment between component mount and data fetch shows empty state

### Systematic Debugging Approach
When experiencing data loading issues, follow this proven checklist:

1. **Check Environment Variables FIRST**
   ```bash
   cat .env | grep NEXT_PUBLIC_USE_MOCK_API
   # Expected: NEXT_PUBLIC_USE_MOCK_API=false
   ```

2. **Verify Backend Status**
   ```bash
   curl http://localhost:8080/api/projects?page=1&limit=10
   # Should return JSON with projects data
   ```

3. **Check Browser Console**
   - Look for: `🔍 useProjects - Mock API 사용: false`
   - Look for: `✅ Projects fetched:` with count > 0
   - Any error messages starting with `❌`

### Quick Resolution Steps
```bash
# When you see "No projects found" unexpectedly:
1. pkill -f next     # Stop all Next.js processes
2. npm run dev:api   # Restart with real API mode
3. Hard refresh browser (Cmd+Shift+R)
```

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

### Prohibited Patterns ❌
- Cold/technical language: "Operation failed", "Invalid input"
- Blaming users: "You entered invalid data", "Wrong input"
- Vague messages: "Something went wrong", "Error occurred"
- Generic buttons: "Submit", "OK", "Cancel"

### Tone Validation Commands
```bash
npm run tone:check     # Check for harsh language
npm run tone:errors    # Validate error messages
npm run tone:naming    # Check function naming
npm run tone:validate  # Full tone compliance check
```

## Common Issues & Solutions

### JSON String Parsing in API Responses
When skills come as JSON strings from API:
```typescript
// In useProjects hook
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

### Type Compatibility Issues
Handle both string and number types for numeric fields:
```typescript
// Example: hourlyRate handling
let hourlyRateValue = 0;
if (freelancer?.hourlyRate) {
  if (typeof freelancer.hourlyRate === 'string') {
    hourlyRateValue = parseInt(freelancer.hourlyRate.replace(/[^0-9]/g, '') || '0');
  } else if (typeof freelancer.hourlyRate === 'number') {
    hourlyRateValue = freelancer.hourlyRate;
  }
}
```

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

## Pre-commit Checklist
1. ✅ `npm run lint` - All errors fixed
2. ✅ `npx tsc --noEmit` - No type errors
3. ✅ `npm run tone:validate` - All tone checks passed
4. ✅ Dark mode appearance tested
5. ✅ API calls use service layer
6. ✅ No console.log statements (except debugging)
7. ✅ All imports use @/* paths
8. ✅ User-facing text is supportive and clear

## Backend Integration Notes
- Spring Boot backend must be running on port 8080
- Check `/Users/doseunghyeon/developerApp/JAVA/project_ai01` for backend
- Run backend with: `./gradlew bootRun`
- Backend CORS configured for localhost:3000

## Active Development Areas
1. **Skills API** - `/api/freelancers/skills/` integration
2. **Multi-search** - Tag-based filtering enhancement
3. **Dynamic routing** - Detail pages for freelancers/projects
4. **Settings page** - User preference management
5. **Test framework** - Jest/Vitest implementation needed

## Recent Feature Implementations

### Project Detail Page Enhancements
- **Real-time Statistics**: View counts, applicant numbers, and bookmarks updated every 5 seconds
- **Project Progress Stages**: Visual timeline showing project phases (planning → development → testing → deployment)
- **Q&A/Review System**: 
  - Questions enabled only before project start
  - Reviews enabled only after project completion
  - Tab-based interface for easy switching
- **Related Projects**: Carousel showing similar projects based on skills and category
- **FAQ Section**: Collapsible frequently asked questions
- **Sticky Action Buttons**: Apply/Bookmark buttons remain visible while scrolling

### Freelancer Detail Page Enhancements
- **Skill Verification System**: Visual badges for verified skills with test scores and certificates
- **Project Matching Score**: Algorithm-based compatibility percentage with current project
- **Availability Calendar**: Interactive monthly calendar showing freelancer's schedule
- **Rating Trend Chart**: Visual representation of rating changes over 6 months
- **Work Style Information**: Communication preferences, work hours, and response times
- **Enhanced FAQ Section**: Categorized FAQs with expand/collapse functionality

### Component Library Additions
- **AvailabilityCalendar**: Full-featured calendar component with status indicators
- **RatingTrendChart**: Simple bar chart component for rating visualization
- **ApplicationModal**: Reusable modal for project applications
- **Multi-state Cards**: Cards that adapt based on project/freelancer status

## UI/UX Patterns

### Card Styling
Project and freelancer cards use consistent gradient button styling:
```tsx
<Link className="block w-full text-center bg-gradient-to-r from-blue-50 to-blue-100 
  dark:from-blue-900/50 dark:to-blue-800/50 hover:from-blue-100 hover:to-blue-200 
  dark:hover:from-blue-800/50 dark:hover:to-blue-700/50 text-blue-700 
  dark:text-blue-300 font-medium py-3 rounded-xl transition-all">
  상세보기
</Link>
```

### Modal Patterns
All modals follow consistent structure with backdrop, animation, and keyboard navigation:
```tsx
{showModal && (
  <>
    <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowModal(false)} />
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Modal content */}
    </div>
  </>
)}
```

### Loading States
Use contextual loading messages, not generic ones:
```typescript
const loadingMessages = {
  projects: "Finding perfect projects for you...",
  freelancers: "Discovering talented professionals...",
  profile: "Loading your profile..."
};
```

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
- Real-time updates using setInterval with cleanup

### Text Truncation
Use Tailwind's line-clamp utility for consistent text truncation:
```tsx
<p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2 overflow-hidden">
  {project.description}
</p>
```

## Development Workflow

### Adding New Features
1. Create feature branch from main
2. Implement with TypeScript interfaces first
3. Follow existing component patterns
4. Test in both light/dark modes
5. Run all validation commands
6. Create PR with clear description

### Debugging Tips
- Use browser console for API response inspection
- Check Network tab for failed requests
- Verify localStorage for auth tokens
- Use React Developer Tools for component state
- Enable Tailwind CSS IntelliSense in VS Code

### Common Pitfalls to Avoid
1. **Don't forget dark mode styles** - Every color must have dark: variant
2. **Don't use any type** - Always define proper interfaces
3. **Don't skip loading states** - Users need feedback
4. **Don't hardcode strings** - Use constants or i18n
5. **Don't ignore tone guidelines** - User experience is paramount

*Last Updated: 2025-01-04*