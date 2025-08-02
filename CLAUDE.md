# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
TechBridge (formerly JobKorea Billboard) - A modern IT freelancer matching platform connecting talented freelancers with companies. Built with Next.js 14 App Router, React 18, TypeScript, and Spring Boot backend. Features include 3D rotating carousel, glassmorphism effects, real-time search, AI-powered recommendations, and comprehensive project/freelancer management with both onsite (상주) and remote (재택) project support.

### Project Path
/Users/doseunghyeon/developerApp/react/aiproject02

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
npm test                     # Unit tests (not yet implemented)
npm run test:e2e            # E2E tests (not yet implemented)
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
- **Real-time**: Socket.io-client 2.5.0 for WebSocket (v2.x required for backend compatibility)
- **Authentication**: JWT stored in localStorage
- **Database**: MariaDB 3.4.2
- **Backend**: Spring Boot (localhost:8080) + Socket.io (localhost:9092)
- **Icons**: Lucide React 0.525.0, Heroicons 2.2.0

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
4. **NO console.log in production code** - Remove all console statements to prevent hydration errors

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

# WebSocket Configuration
NEXT_PUBLIC_ENABLE_WEBSOCKET=true
NEXT_PUBLIC_WS_URL=http://localhost:9092
```

Additional production environment variables (see `.env.production.example`):
- Analytics (Google Analytics, Sentry)
- Payment gateway configuration
- CDN URL for static assets
- Rate limiting settings
- SMTP configuration for emails

## CI/CD Pipeline

### GitHub Actions Workflow (`.github/workflows/ci.yml`)
Automated pipeline runs on push/PR to develop/main branches:

1. **Code Quality Checks**
   - ESLint validation
   - TypeScript type checking
   - Tone and manner validation
   - Dependency checks

2. **Testing** (continue-on-error: true)
   - Unit tests (not yet implemented)
   - E2E tests (not yet implemented)

3. **Build Verification**
   - Development build
   - Production build (with bundle analysis)

4. **Performance Audits**
   - Lighthouse CI with budget checks
   - Performance metrics validation

5. **Security Scans**
   - npm audit
   - Snyk vulnerability scanning

6. **Deployment**
   - Staging: Auto-deploy develop branch to Vercel
   - Production: Auto-deploy main branch to Vercel
   - Slack notifications for deployment status

## Performance Standards

### Lighthouse Budget (`lighthouse-budget.json`)
Performance thresholds enforced in CI/CD:

**Timing Metrics**:
- First Contentful Paint (FCP): 1800ms
- Largest Contentful Paint (LCP): 2500ms
- Speed Index: 3400ms
- Total Blocking Time (TBT): 300ms
- Cumulative Layout Shift (CLS): 0.1

**Resource Budgets**:
- Scripts: 200KB max
- Stylesheets: 100KB max
- Images: 500KB max
- Total size: 1000KB max

**Resource Counts**:
- Scripts: 10 max
- Images: 30 max
- Total resources: 50 max

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

### Hydration Errors Prevention
**Problem**: Server-client mismatch causing hydration errors
**Solutions**:
1. Remove all console.log statements in components
2. Use `suppressHydrationWarning` for dynamic content
3. Track mounted state for client-only features:
```typescript
const [mounted, setMounted] = useState(false);
useEffect(() => {
  setMounted(true);
}, []);
// Use: {mounted && <ClientOnlyComponent />}
```
4. Clear cache when persistent: `rm -rf .next && pkill -f next`

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
    // Failed to parse requiredSkills
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
- Code splitting and lazy loading for better initial load
- API response caching with cache service layer

See detailed optimization documentation:
- `PERFORMANCE_ANALYSIS.md` - Performance issues analysis
- `OPTIMIZATION_IMPLEMENTATION.md` - Implementation guide
- `OPTIMIZATION_SUMMARY.md` - Completed optimizations summary

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

## Real-time WebSocket Integration

### Client-side WebSocket Setup
- WebSocket service at `/src/services/websocket.ts`
- Custom hook `useRealtimeStats` for real-time statistics
- WebSocketProvider wraps the app for connection management
- Auto-reconnect with exponential backoff
- Room-based subscriptions for projects/freelancers

### Server-side WebSocket Implementation
- Socket.io server runs on port 9092 (separate from main API)
- Event handlers in `/websocket/` directory
- Real-time updates for:
  - Viewer count (join/leave)
  - Application count
  - Bookmark count
  - Inquiry notifications

### WebSocket Events
- `join_project` / `leave_project` - Project room management
- `join_freelancer` / `leave_freelancer` - Freelancer room management  
- `realtime_update` / `stats_update` - Statistics broadcasts

## Backend Server Commands
```bash
cd /Users/doseunghyeon/developerApp/JAVA/project_ai01
./gradlew bootRun  # Starts both Spring Boot (8080) and Socket.io (9092)
```

## Cursor Rules Integration

Key rules from `.cursor/rules/` that should be followed:

### Error Prevention Protocol
- **Always verify library compatibility** before integration
- **Run type checks** before committing: `npx tsc --noEmit`
- **Test incrementally** - add features gradually, test after each addition
- **Never assume file recreation solves syntax errors**

### UI Implementation Excellence
- **Dark mode is mandatory** - Always include `dark:` prefixes
- **Responsive design** - Mobile-first approach
- **Glassmorphism effects** - Use backdrop-blur and transparency
- **Consistent spacing** - Follow Tailwind's spacing scale

### TypeScript Safety
- **No `any` types** in production code
- **Explicit return types** for all functions
- **Type guards** for external data
- **Proper null/undefined handling** with optional chaining

## Recent Major Features

### 1. Remote Project (재택 프로젝트) Full Implementation
- Complete API integration for remote project pages (`/athome/*`)
- Service layer: `remoteProjectService` with all CRUD operations
- Custom hooks: `useRemoteProjects`, `useRemoteProjectDetail`
- Features: search, filtering, pagination, apply, bookmark, inquire
- **Known Issue**: styled jsx causes JSX parsing errors - use CSS Modules instead

### 2. Enhanced Freelancer Filtering System
- **Advanced filters**: Hourly rate range, experience levels, ratings, project count, availability
- **Improved sorting**: By popularity, rating, hourly rate, experience, recent activity
- **URL parameter sync**: Shareable filter states via URL
- **Visual filter tags**: Applied filters shown as removable tags
- See `FREELANCER_IMPROVEMENTS.md` for detailed implementation

### 3. Common UI Components
- **BookmarkButton**: Reusable bookmark toggle with auth check
- **ApplyModal**: Project application modal with form validation
- **InquiryModal**: Inquiry form modal with contact info
- **OptimizedImage**: Next.js Image wrapper with lazy loading
- **VirtualList**: Virtual scrolling for large lists
- **NotificationItem**: Real-time notification component

### 4. API Response Transformations
- Handle JSON string fields (skills, techStack) from backend
- Type safety with proper interfaces
- Error handling with user-friendly messages

### 5. Performance Monitoring
- Custom `usePerformanceMonitor` hook for tracking metrics
- Lighthouse CI integration in GitHub Actions
- Bundle size analysis with webpack-bundle-analyzer

## Database Structure

### Core Tables
- **users**: User authentication and profiles
- **freelancers**: Freelancer profiles with skills, rates, availability
- **projects**: Both onsite and remote project listings
- **categories**: Project and skill categorization
- **applications**: Job applications tracking
- **notifications**: Real-time notification system

### Database Management Scripts
```bash
npm run test:db          # Test database connection
npm run db:schema        # Apply full schema
npm run db:categories    # Update categories table
npm run db:update        # Run database migrations
```

See `database/DATABASE_SETUP.md` for complete schema and setup instructions.

## Environment Variable Management

### Key Environment Files
- `.env.local` - Local development (git-ignored)
- `.env.development` - Development defaults
- `.env.production` - Production configuration
- `.env.local.example` - Template for local setup
- `.env.production.example` - Production template

### Environment Variable Guide
- Client-side variables MUST use `NEXT_PUBLIC_` prefix
- Server-side variables are accessible only in API routes/SSR
- All env vars are managed through `src/utils/env.ts`
- See `환경변수_가이드.md` for detailed usage patterns

## Page Structure

### Main Sections
- `/` - Landing page with carousel and features
- `/project/*` - Onsite project listings and details
- `/athome/*` - Remote project listings and details  
- `/freelancer/*` - Freelancer directory and profiles
- `/recommendations` - AI-powered recommendations
- `/notifications` - Real-time notification center
- `/profile` - User profile management
- `/settings` - Application settings

### Authentication Pages
- `/login` - User authentication
- `/register` - New user registration
- `/membership` - Membership plans

### Information Pages
- `/about` - Company information
- `/help` - Help center
- `/support` - Customer support
- `/privacy` - Privacy policy
- `/terms` - Terms of service

## Active Development Areas
1. **Remote Project System** - Complete with all features
2. **Freelancer Advanced Filtering** - Recently enhanced
3. **Real-time Notifications** - WebSocket integration complete
4. **Recommendation System** - AI-powered matching
5. **Performance Optimizations** - Ongoing improvements
6. **SEO Enhancement** - Sitemap, metadata, structured data

## Known Issues & Workarounds

### TypeScript Strict Mode Issues
When encountering strict null checks:
```typescript
// Use optional chaining and nullish coalescing
const value = data?.field ?? defaultValue;
```

### WebSocket Connection Management
- Auto-reconnect implemented with exponential backoff
- Room-based subscriptions prevent memory leaks
- Check `NEXT_PUBLIC_ENABLE_WEBSOCKET` env var

### Image Optimization
- Use `OptimizedImage` component for all images
- Configure remote patterns in `next.config.js`
- Lazy loading enabled by default

## Socket.IO Version Compatibility

### WebSocket Version Mismatch
**Important**: Backend uses Socket.IO v2.x, frontend must use compatible version
```bash
# ✅ CORRECT - Use Socket.IO client v2.5.0
"socket.io-client": "^2.5.0"
"@types/socket.io-client": "^1.4.36"

# ❌ WRONG - v3.x or v4.x will cause connection errors
```

**Connection Configuration**:
```typescript
// v2.x uses query for auth (not auth object)
const socket = io(wsUrl, {
  query: {
    token: localStorage.getItem('auth_token') || ''
  }
});
```

## Testing and Debugging

### Running Single Tests
```bash
# Run specific test file (when tests are implemented)
npm test -- path/to/test.spec.ts

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Debug WebSocket Issues
```bash
# Check Socket.IO server version
curl http://localhost:9092/socket.io/socket.io.js | head -n 10

# Monitor WebSocket connections
# Open Chrome DevTools > Network > WS tab
```

### Debug API Issues
```bash
# Test backend health
curl http://localhost:8080/api/health

# Test specific endpoints
curl http://localhost:8080/api/projects?page=1&limit=10
curl http://localhost:8080/api/freelancers?page=1&limit=10
```

## 🚨 CRITICAL: Common JSX Errors & Prevention Rules

### styled jsx Not Supported in App Router
**Problem**: Next.js 14 App Router doesn't support `<style jsx>` tags
```jsx
// ❌ WRONG - This will cause "Unexpected token" errors
<style jsx>{`
  @keyframes animation { ... }
`}</style>

// ✅ CORRECT - Use CSS Modules or Tailwind classes
import styles from './page.module.css'
<div className={styles.animateFloat}>
```

**Prevention Rules**:
1. NEVER use `<style jsx>` in App Router components
2. Always use CSS Modules for custom animations/styles
3. When copying code, check for styled jsx and remove it
4. Replace animation classes with CSS Module imports

### JSX Parsing Error Debug Process
When encountering "Unexpected token" errors:
1. **Check for styled jsx tags first** - Most common cause
2. **Look for syntax errors ABOVE the reported line** - Parser often reports wrong line
3. **Verify all JSX tags are properly closed**
4. **Check for invalid characters or encoding issues**

### File Recreation Best Practices
**❌ NEVER DO THIS**:
- Recreate file with same problematic code
- Copy from backup without reviewing content
- Assume file recreation solves syntax errors

**✅ ALWAYS DO THIS**:
1. Identify the exact problematic code section
2. Fix the root cause (e.g., remove styled jsx)
3. Test incrementally with minimal code first
4. Add features back gradually

### Error Recovery Checklist
When a component has persistent errors:
```bash
1. pkill -f next              # Kill all Next.js processes
2. rm -rf .next              # Clear build cache
3. rm -rf node_modules/.cache # Clear node_modules cache
4. npm run dev               # Restart dev server
```

If errors persist:
1. Create minimal working version first
2. Add code sections incrementally
3. Test after each addition
4. Use grep to find problematic patterns:
   ```bash
   grep -n "style jsx" src/app/**/*.tsx
   grep -n "<style" src/app/**/*.tsx
   ```

### Current Build Issues

None at this time. Previous JSX parsing errors have been resolved by removing styled-jsx usage.

## High-Level Architecture

### Data Flow Pattern
1. **User Action** → Component Event Handler
2. **Component** → Custom Hook (e.g., `useProjects`)
3. **Custom Hook** → Service Layer (e.g., `projectService`)
4. **Service Layer** → Axios Instance with interceptors
5. **Axios** → Backend API (Spring Boot)
6. **Response** → Service transforms data → Hook updates state → Component re-renders

### State Management Architecture
- **Authentication**: Zustand store with localStorage persistence
- **UI State**: React component state for local UI
- **Server State**: Custom hooks with built-in caching
- **Real-time State**: WebSocket service with event-based updates
- **Theme State**: Dark mode toggle with system preference detection

### API Architecture
- **RESTful endpoints**: `/api/projects`, `/api/freelancers`, etc.
- **WebSocket events**: Real-time statistics and notifications
- **Mock/Real API switch**: Environment variable controlled
- **Response transformation**: Service layer handles backend format differences

### Critical Dependencies Version Locks
```json
{
  "socket.io-client": "^2.5.0",  // MUST be v2.x for backend compatibility
  "next": "^14.1.0",              // App Router features required
  "react": "^18.2.0",             // Server Components support
  "zustand": "^5.0.3"             // Persistence middleware required
}
```

## Custom Hooks Pattern

### Data Fetching Hooks
- `useProjects` - Project listing with pagination, filtering, sorting
- `useRemoteProjects` - Remote project specific features
- `useFreelancers` - Freelancer directory management
- `useNotifications` - Real-time notification handling
- `useRecommendations` - AI-powered recommendations
- `useNumberFormat` - Korean currency formatting (만원)
- `useDebounce` - Search input debouncing

### Hook Usage Example
```typescript
const { data, loading, error, refetch } = useProjects({
  page: 1,
  limit: 10,
  category: 'web-development',
  skills: ['React', 'Node.js']
});
```

## Error Handling Standards

### API Error Responses
All API errors should follow this format:
```typescript
interface ApiError {
  message: string;      // User-friendly message
  code: string;         // Error code for debugging
  details?: any;        // Additional error context
}
```

### Error Display Pattern
```typescript
try {
  await apiCall();
} catch (error) {
  // User-friendly message
  alert('프로젝트 등록 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
  // Log for debugging (development only)
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', error);
  }
}
```

## Security Best Practices

### Authentication Headers
```typescript
// Always use the auth service for token management
const token = localStorage.getItem(getAuthTokenName());
headers['Authorization'] = token ? `Bearer ${token}` : '';
```

### API Security
- Never expose sensitive data in console.log
- Validate all user inputs before API calls
- Use HTTPS in production
- Implement CORS properly on backend

## Development Workflow

### Feature Development Process
1. Create feature branch from `develop`
2. Implement with TypeScript strict mode compliance
3. Ensure dark mode support for all UI elements
4. Run quality checks: `npm run lint && npx tsc --noEmit && npm run tone:validate`
5. Test with both mock and real API: `npm run dev:mock` then `npm run dev:api`
6. Create PR to `develop` branch

### Before Committing
```bash
# Required checks
npm run lint              # Fix all ESLint errors
npx tsc --noEmit         # Ensure no TypeScript errors
npm run tone:validate    # Check tone compliance

# Optional but recommended
npm run depcheck         # Check for unused dependencies
npm run analyze          # Check bundle size
```

*Last Updated: 2025-01-08*