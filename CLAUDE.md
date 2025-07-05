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

### Tone and Manner Validation
```bash
npm run tone:check     # Check for harsh language in UI text
npm run tone:errors    # Validate error messages are supportive
npm run tone:naming    # Check function naming conventions
npm run tone:validate  # Run all tone checks
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

### API Integration Pattern
- All API calls MUST go through service layer (`/src/services/`)
- Backend API proxied via Next.js rewrites: `/api/*` → `http://localhost:8080/api/*`
- Custom hooks in `/src/hooks/` for data fetching (e.g., `useProjects`, `useFreelancers`)
- Mock data support via `NEXT_PUBLIC_USE_MOCK_API` environment variable
- Axios instance with interceptors for auth token injection

### Component Architecture
- **Server Components by default** - Better performance, SEO
- **Client Components** - Only when interactivity needed (`'use client'`)
- **Custom Hooks** - Data fetching abstracted in `/src/hooks/`
- **Service Layer** - API calls isolated in `/src/services/`
- **Type Safety** - Interfaces in `/src/types/`

## Critical Development Rules

### TypeScript & Imports
1. **ALWAYS use `@/*` import paths** - Never use relative imports
2. **NO `any` types** - Define proper interfaces
3. **Maintain strict mode** - All TypeScript strict checks enabled

### Component Development
1. **Server Components by default** - Only add `'use client'` when needed
2. **Dark mode required** - Use `dark:` prefix for all styles
3. **No custom CSS files** - Use Tailwind CSS exclusively
4. **Responsive design** - Mobile-first approach

### Code Quality
1. **Run lint before commit**: `npm run lint`
2. **Check types**: `npx tsc --noEmit`
3. **Validate tone**: `npm run tone:validate`
4. **Console logs** - Only for debugging with prefixes (🔍, ✅, ❌)

## 🎭 Tone and Manner Standards (MANDATORY)

### Core Principles
1. **Respect First**: Acknowledge user effort, never assume knowledge level
2. **Clarity Above All**: Use active voice, specific words, logical structure
3. **Solution-Oriented**: Lead with what users CAN do, provide clear next steps

### User-Facing Text Rules
- **Error Messages Formula**: [Acknowledgment] + [Clear explanation] + [Specific action] + [Support offer]
- **Success Messages**: Celebrate achievement + Emphasize benefit + Suggest next step
- **Loading States**: Context-specific engaging messages (NOT generic "Loading...")
- **Empty States**: Helpful guidance with specific actions (NOT "No results found")

### Enforcement
- All error messages must use `// TONE: OK` comment if they contain Error/Failed/Invalid/Wrong
- Run `npm run tone:validate` before committing
- Pre-commit hooks enforce tone compliance

## Database Configuration
- **Host**: 192.168.0.109
- **Port**: 3306
- **Database**: jobtracker
- **User**: root
- **Password**: ~Asy10131227 (in scripts)

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

## 🚨 CRITICAL: Project Loading Issues Prevention

### Problem: "No matching projects found" displays immediately on page load

### Quick Resolution
```bash
# When you see "No projects found" unexpectedly:
1. pkill -f next     # Stop all Next.js processes
2. npm run dev:api   # Restart with real API mode
3. Hard refresh browser (Cmd+Shift+R)
```

### Debugging Checklist
1. Check environment: `cat .env | grep NEXT_PUBLIC_USE_MOCK_API`
2. Verify backend: `curl http://localhost:8080/api/projects?page=1&limit=10`
3. Check console for: `🔍 useProjects - Mock API 사용: false`

## Common Issues & Solutions

### JSON String Parsing in API Responses
When skills come as JSON strings from API:
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

### Type Compatibility Issues
Handle both string and number types for numeric fields:
```typescript
let hourlyRateValue = 0;
if (freelancer?.hourlyRate) {
  if (typeof freelancer.hourlyRate === 'string') {
    hourlyRateValue = parseInt(freelancer.hourlyRate.replace(/[^0-9]/g, '') || '0');
  } else if (typeof freelancer.hourlyRate === 'number') {
    hourlyRateValue = freelancer.hourlyRate;
  }
}
```

## Recent Feature Implementations

### Project Detail Page Enhancements
- **Real-time Statistics**: View counts, applicant numbers, and bookmarks updated every 5 seconds
- **Project Progress Stages**: Visual timeline showing project phases
- **Q&A/Review System**: Conditional display based on project status
- **Related Projects**: Carousel showing similar projects
- **FAQ Section**: Collapsible frequently asked questions
- **Sticky Action Buttons**: Apply/Bookmark buttons remain visible

### Freelancer Detail Page Enhancements
- **Skill Verification System**: Visual badges for verified skills
- **Project Matching Score**: Algorithm-based compatibility percentage
- **Availability Calendar**: Interactive monthly calendar
- **Rating Trend Chart**: Visual representation of rating changes
- **Work Style Information**: Communication preferences and work hours
- **Enhanced FAQ Section**: Categorized FAQs with expand/collapse

### Component Library Additions
- `AvailabilityCalendar`: Full-featured calendar component
- `RatingTrendChart`: Simple bar chart for rating visualization
- `ApplicationModal`: Reusable modal for project applications

## UI/UX Patterns

### Card Button Styling
```tsx
<Link className="block w-full text-center bg-gradient-to-r from-blue-50 to-blue-100 
  dark:from-blue-900/50 dark:to-blue-800/50 hover:from-blue-100 hover:to-blue-200 
  dark:hover:from-blue-800/50 dark:hover:to-blue-700/50 text-blue-700 
  dark:text-blue-300 font-medium py-3 rounded-xl transition-all">
  상세보기
</Link>
```

### Modal Pattern
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

### Text Truncation
```tsx
<p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2 overflow-hidden">
  {project.description}
</p>
```

## Performance Optimizations
- Debounced search (500ms) to reduce API calls
- Pagination with "Load More" pattern
- Memoized expensive computations with React.memo
- Optimistic UI updates for better UX
- Real-time updates using setInterval with proper cleanup
- Image optimization with Next.js Image component

## Pre-commit Checklist
1. ✅ `npm run lint` - All errors fixed
2. ✅ `npx tsc --noEmit` - No type errors
3. ✅ `npm run tone:validate` - All tone checks passed
4. ✅ Dark mode appearance tested
5. ✅ API calls use service layer
6. ✅ All imports use @/* paths
7. ✅ User-facing text is supportive and clear

## Backend Integration
- Spring Boot backend must be running on port 8080
- Backend path: `/Users/doseunghyeon/developerApp/JAVA/project_ai01`
- Run backend: `./gradlew bootRun`
- Backend CORS configured for localhost:3000

## Active Development Areas
1. **Skills API** - `/api/freelancers/skills/` integration
2. **Multi-search** - Tag-based filtering enhancement
3. **Dynamic routing** - Detail pages for freelancers/projects
4. **Settings page** - User preference management
5. **Test framework** - Jest/Vitest implementation needed

*Last Updated: 2025-01-04*