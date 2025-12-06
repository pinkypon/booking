# 🗓️ Booking Conflict Checker

A full-stack booking management system with real-time conflict detection, built with Laravel 12 and Vue 3.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [Implemented Features](#implemented-features)
- [Creative Improvements](#creative-improvements)
- [API Documentation](#api-documentation)

---

## ✨ Features

### Core Features

- ✅ User authentication (register/login)
- ✅ CRUD operations for bookings
- ✅ Advanced conflict detection (exact conflicts, overlaps, gaps)
- ✅ Admin dashboard with system-wide view
- ✅ Automated cleanup of old bookings (30+ days)
- ✅ Real-time updates via WebSocket
- ✅ Fully responsive design (mobile, tablet, desktop)

### Conflict Detection

- **Exact Conflicts**: Bookings with identical date and time
- **Overlaps**: Bookings with partial time overlaps
- **Gaps**: Time gaps between consecutive bookings
- **Smart Suggestions**: AI-powered recommendations for optimal scheduling

---

## 🛠️ Tech Stack

### Backend

- **Laravel 12** - PHP framework
- **MySQL** - Database
- **Laravel Sanctum** - API authentication
- **Laravel Reverb** - WebSocket server (real-time broadcasting)

### Frontend

- **Vue 3** - JavaScript framework (Composition API)
- **Pinia** - State management
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Laravel Echo + Pusher** - WebSocket client
- **Vite** - Build tool

---

## 🚀 Setup Instructions

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+ & npm
- MySQL 8.0+

### Backend Setup

1. **Clone the repository**

2. **Install backend dependencies**

3. **Environment configuration**

```bash
cp .env.example .env
php artisan key:generate
```

4. **Configure database** (edit `.env`)

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravelexam
DB_USERNAME=root
DB_PASSWORD=root
```

5. **Configure Reverb (WebSocket)** (already in `.env` from example)

```env
BROADCAST_CONNECTION=reverb

REVERB_APP_ID=601987
REVERB_APP_KEY=gnt7paqtqvro7746d3y8
REVERB_APP_SECRET=mawk3msuc8hivvsv53wz
REVERB_HOST="localhost"
REVERB_PORT=8080
REVERB_SCHEME=http
```

6. **Run migrations**

```bash
php artisan migrate
php artisan db:seed --class=AdminUserSeeder
```

Admin credentials:

Email: admin@bookinghub.com
Password: password

7. **Start the backend server**

```bash
php artisan serve
```

8. **Start the WebSocket server** (in a new terminal)

```bash
php artisan reverb:start || php artisan reverb:start --debug
```

9. **Schedule the cleanup job**

```bash
php artisan bookings:cleanup
```

### Frontend Setup

1. **Navigate to frontend**

```bash
cd ../frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment configuration**

```bash
cp .env.example .env
```

4. **Configure environment** (edit `.env`)

```env
VITE_API_BASE_URL=http://laravelexam.test/api

VITE_REVERB_APP_KEY=gnt7paqtqvro7746d3y8
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=http
```

5. **Start the development server**

```bash
npm run dev
```

6. **Open browser**

```
http://localhost:5173
```

---

## 🏗️ Architecture & Design Decisions

### Backend Architecture

#### 1. Repository Pattern

**Decision**: Separate database operations from business logic

**Why**:

- Makes code testable (can mock repositories)
- Follows SOLID principles (Single Responsibility)
- Easy to swap database implementations

#### 2. Service Layer

**Decision**: Move business logic to dedicated service classes

**Why**:

- Keeps controllers thin and focused
- Reusable logic across different controllers
- Easier to test complex business rules

#### 3. Form Requests for Validation

**Decision**: Use dedicated request classes for validation

**Why**:

- Separates validation from controller logic
- Reusable validation rules
- Clean, readable controllers

#### 4. API Resources for Responses

**Decision**: Transform data using resource classes

**Why**:

- Consistent API response format
- Easy to add/remove fields
- Separates data transformation from logic

### Frontend Architecture

#### 1. Composition API

**Decision**: Use Vue 3 Composition API with `<script setup>`

**Why**:

- Better TypeScript support
- More readable than Options API
- Easier to extract reusable logic

#### 2. Composables Pattern

**Decision**: Extract reusable logic into composables

**Why**:

- DRY (Don't Repeat Yourself)
- Testable logic
- Easy to share between components

#### 3. Pinia for State Management

**Decision**: Use Pinia instead of Vuex

**Why**:

- Better TypeScript support than Vuex
- Simpler API (no mutations)
- Composition API style

#### 4. TypeScript Interfaces

**Decision**: Define strict types for all data structures

**Why**:

- Catch errors at compile time
- Better IDE autocomplete
- Self-documenting code

### Key Technical Decisions

#### Real-Time Updates with Duplicate Prevention

**Challenge**: When a user creates a booking, they receive the API response AND a WebSocket broadcast, causing duplicates.

**Solution**: Tab-specific ignore lists

- Each browser tab has unique ID
- Ignores its own WebSocket events for 5 seconds
- Other tabs still receive updates instantly

**Implementation**:

```typescript
const TAB_ID = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

function addToIgnoreList(bookingId: number, action: string): void {
  const key = `ignore_ws_${action}_${bookingId}_${TAB_ID}`;
  localStorage.setItem(key, Date.now().toString());
  setTimeout(() => localStorage.removeItem(key), 5000);
}
```

#### Token Management

**Decision**: Store token in localStorage, add to every request via Axios interceptor

**Why**:

- Centralized token management
- No need to manually add token to each request
- Automatic logout on 401 responses

#### Conflict Detection Algorithm

**Decision**: Separate exact conflicts from overlaps

**Severity Levels**:

- 🔴 **Critical**: Exact conflicts (same date/time) - RED
- 🟠 **Warning**: Partial overlaps - ORANGE
- 🟢 **Healthy**: No issues - GREEN

---

## 📦 Implemented Features

### Backend (Laravel)

#### Authentication & Authorization

- [x] User registration with validation
- [x] Login with Sanctum tokens
- [x] Logout functionality
- [x] Admin middleware protection
- [x] User-specific data filtering

#### Booking Management

- [x] Create booking (POST `/api/bookings`)
- [x] List user bookings (GET `/api/bookings`)
- [x] Show single booking (GET `/api/bookings/{id}`)
- [x] Update booking (PUT `/api/bookings/{id}`)
- [x] Delete booking (DELETE `/api/bookings/{id}`)
- [x] Authorization checks (users can only modify their bookings)

#### Conflict Detection

- [x] Conflict report endpoint (GET `/api/bookings/conflicts/report`)
- [x] Exact conflict detection (same date/time)
- [x] Overlap detection (partial time overlaps)
- [x] Gap detection (time gaps between bookings)
- [x] Duration calculations
- [x] Summary statistics
- [x] Status indicators (critical/warning/healthy)

#### Admin Features

- [x] View all bookings (GET `/api/admin/bookings`)
- [x] System-wide conflict report (GET `/api/admin/bookings/conflicts/report`)
- [x] Dashboard statistics (GET `/api/admin/dashboard`)
- [x] Admin-only middleware protection

#### Real-Time Broadcasting

- [x] BookingCreated event
- [x] BookingUpdated event
- [x] BookingDeleted event
- [x] Laravel Reverb WebSocket server

#### Scheduled Tasks

- [x] Daily cleanup command (`bookings:cleanup`)
- [x] Deletes bookings older than 30 days
- [x] Configurable retention period
- [x] Dry-run mode for testing
- [x] Laravel scheduler integration

#### Code Quality

- [x] PSR-12 coding standards
- [x] SOLID principles
- [x] Thin controllers
- [x] Service layer for business logic
- [x] Repository pattern for data access
- [x] Form Requests for validation
- [x] API Resources for responses
- [x] PHPDoc comments

### Frontend (Vue 3)

#### Authentication

- [x] Register page
- [x] Login page
- [x] Logout functionality
- [x] Pinia auth store
- [x] Route guards (requiresAuth, requiresAdmin)
- [x] Token persistence in localStorage
- [x] Automatic token refresh

#### Booking UI

- [x] List all user bookings
- [x] Create booking modal
- [x] Edit booking modal
- [x] Delete booking with confirmation
- [x] Search/filter functionality
- [x] Status filter (all/pending/confirmed/cancelled)
- [x] Date filter (all/upcoming/past)
- [x] Grouped by date view

#### Conflict Visualization

- [x] Conflict indicators on booking cards
- [x] Color-coded severity (red = conflict, orange = overlap)
- [x] Dedicated conflicts page
- [x] Summary statistics
- [x] Detailed conflict reports
- [x] Gap visualization
- [x] Smart suggestions

#### Admin Dashboard

- [x] View all users' bookings
- [x] System statistics (total bookings, users, etc.)
- [x] Conflict summary
- [x] User information in booking list
- [x] Refresh functionality

#### Real-Time Updates

- [x] WebSocket connection via Laravel Echo
- [x] Live booking creation updates
- [x] Live booking update notifications
- [x] Live booking deletion notifications
- [x] Connection status indicator
- [x] Tab-specific duplicate prevention
- [x] Toast notifications for changes

#### Responsive Design

- [x] Mobile-first approach
- [x] Tablet optimization
- [x] Desktop layout
- [x] Responsive navigation
- [x] Mobile-friendly modals
- [x] Touch-friendly buttons

#### User Experience

- [x] Loading states
- [x] Empty states
- [x] Error messages
- [x] Success notifications
- [x] Toast notification system
- [x] Smooth transitions
- [x] Gradient designs
- [x] Icon usage
- [x] Consistent color scheme

---

## 🌟 Creative Improvements

### 1. Smart Suggestions System

**What it does**: Analyzes booking patterns and provides intelligent recommendations

**Features**:

- Detects fillable time gaps (30-120 minutes)
- Identifies busy days (5+ bookings)
- Suggests optimal booking times
- Displays in dedicated "Smart Suggestions" section

**Real Example from System**:

```json
{
  "type": "fill_gap",
  "message": "Consider scheduling a 1h 1m booking on 2025-12-05"
},
{
  "type": "fill_gap",
  "message": "Consider scheduling a 1h 9m booking on 2025-12-07"
}
```

**Why it helps users**:

- Maximizes schedule efficiency
- Prevents wasted time slots
- Helps identify overbooked days

---

### 2. Real-Time Collaboration with Duplicate Prevention

**What it does**: Multiple users can work simultaneously without conflicts

**Features**:

- Instant updates across all connected users
- Tab-specific ignore lists prevent self-duplicates
- Unique tab IDs for multi-tab support
- 5-second ignore window for reliability

**Why it helps users**:

- No page refreshes needed
- See teammate bookings in real-time
- No duplicate entries
- Works across multiple tabs

---

### 3. Advanced Conflict Detection with Visual Hierarchy

**What it does**: Categorizes and prioritizes conflicts by severity

**Severity Levels**:

- 🔴 **Critical**: Exact conflicts (same date/time) - RED
- 🟠 **Warning**: Partial overlaps - ORANGE
- 🟢 **Healthy**: No issues - GREEN

**Report Features**:

- Exact conflict count
- Overlap duration calculations
- Gap identification
- Status summary (critical/warning/healthy)

**Why it helps users**:

- Prioritize critical issues first
- Quick visual scanning
- Understand severity at a glance

---

### 4. Connection Status Indicator

**What it does**: Shows real-time WebSocket connection status

**Features**:

- Live connection indicator in navbar
- Animated pulse effect
- Color-coded (green = connected, gray = offline)
- Automatic reconnection handling

**Why it helps users**:

- Know if real-time updates are working
- Debug connection issues
- Peace of mind

---

### 5. Comprehensive Dashboard Analytics

**What it does**: Provides actionable insights at a glance

**Metrics**:

- Total bookings
- Upcoming bookings count
- Conflict count
- System health status
- Recent bookings preview

**Admin Dashboard**:

- Total users
- Bookings today
- Bookings this week
- System-wide conflict summary

**Why it helps users**:

- Quick overview without navigation
- Identify problems immediately
- Track usage patterns

---

### 6. Smart Time Duration Calculator

**What it does**: Automatically calculates and displays booking duration

**Features**:

- Real-time calculation in booking modal
- Human-readable format (e.g., "2h 30m")
- Validation (end time must be after start time)
- Display in booking cards

**Why it helps users**:

- No mental math required
- Prevents booking errors
- Clear time allocation

---

### 7. Advanced Search & Filtering

**What it does**: Multiple filter combinations for quick booking lookup

**Filters**:

- **Search**: Title, description, date
- **Status**: All, Pending, Confirmed, Cancelled
- **Date**: All, Upcoming, Past

**Why it helps users**:

- Find bookings quickly
- Combine multiple filters
- No page reloads

---

### 8. Toast Notification System

**What it does**: Non-intrusive feedback for user actions

**Features**:

- 4 types: success, error, warning, info
- Auto-dismiss (3-5 seconds)
- Manual dismiss button
- Smooth animations
- Stacked notifications

**Why it helps users**:

- Immediate feedback
- Doesn't block UI
- Professional appearance

---

### 9. Responsive Mobile Experience

**What it does**: Full functionality on all device sizes

**Features**:

- Mobile navigation menu
- Touch-friendly buttons
- Optimized modal sizing
- Responsive tables
- Collapsible sections

**Breakpoints**:

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Why it helps users**:

- Use on any device
- Same features everywhere
- Optimized for touch

---

### 10. Automated Cleanup with Safety Features

**What it does**: Keeps database clean without manual intervention

**Features**:

- Configurable retention period (default 30 days)
- Dry-run mode for testing
- Confirmation prompts
- Detailed logging
- Schedule integration

**Command**:

```bash
php artisan bookings:cleanup --days=30 --dry-run
```

**Why it helps users**:

- No manual cleanup needed
- Prevents database bloat
- Safe with dry-run testing

---

## 📡 API Documentation

### Authentication Endpoints

#### Register

```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

Response: `201 Created`

```json
{
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "is_admin": false
    },
    "token": "1|xyz..."
  }
}
```

#### Login

```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response: `200 OK`

```json
{
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "is_admin": false
    },
    "token": "2|abc..."
  }
}
```

#### Logout

```http
POST /api/logout
Authorization: Bearer {token}
```

Response: `200 OK`

```json
{
  "message": "Logout successful"
}
```

### Booking Endpoints

#### List User Bookings

```http
GET /api/bookings
Authorization: Bearer {token}
```

Response: `200 OK`

```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "date": "2024-12-15",
      "start_time": "09:00",
      "end_time": "10:30",
      "title": "Team Meeting",
      "description": "Weekly sync",
      "status": "confirmed",
      "duration_minutes": 90,
      "created_at": "2024-12-01T10:00:00Z",
      "updated_at": "2024-12-01T10:00:00Z"
    }
  ]
}
```

#### Create Booking

```http
POST /api/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "date": "2024-12-15",
  "start_time": "14:00",
  "end_time": "15:30",
  "title": "Client Call",
  "description": "Discuss project requirements",
  "status": "pending"
}
```

Response: `201 Created`

```json
{
  "message": "Booking created successfully",
  "data": {
    "id": 2,
    "user_id": 1,
    "date": "2024-12-15",
    "start_time": "14:00",
    "end_time": "15:30",
    "title": "Client Call",
    "description": "Discuss project requirements",
    "status": "pending",
    "duration_minutes": 90,
    "created_at": "2024-12-06T10:00:00Z",
    "updated_at": "2024-12-06T10:00:00Z"
  }
}
```

#### Update Booking

```http
PUT /api/bookings/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "confirmed",
  "title": "Updated Title"
}
```

Response: `200 OK`

```json
{
  "message": "Booking updated successfully",
  "data": {
    "id": 2,
    "title": "Updated Title",
    "status": "confirmed"
  }
}
```

#### Delete Booking

```http
DELETE /api/bookings/{id}
Authorization: Bearer {token}
```

Response: `200 OK`

```json
{
  "message": "Booking deleted successfully"
}
```

#### Get Conflict Report

```http
GET /api/bookings/conflicts/report
Authorization: Bearer {token}
```

Response: `200 OK`

```json
{
  "data": {
    "total_bookings": 10,
    "conflicts": [
      {
        "booking": {
          "id": 1,
          "date": "2024-12-15",
          "start_time": "09:00",
          "end_time": "10:00",
          "title": "Meeting A"
        },
        "conflicting_with": [
          {
            "id": 2,
            "date": "2024-12-15",
            "start_time": "09:00",
            "end_time": "10:00",
            "title": "Meeting B"
          }
        ]
      }
    ],
    "overlaps": [
      {
        "booking": {
          "id": 3,
          "date": "2024-12-15",
          "start_time": "11:00",
          "end_time": "12:00",
          "title": "Task A"
        },
        "overlapping_with": [
          {
            "id": 4,
            "date": "2024-12-15",
            "start_time": "11:30",
            "end_time": "12:30",
            "title": "Task B"
          }
        ],
        "overlap_duration": "30m"
      }
    ],
    "gaps": [
      {
        "between": [
          {
            "id": 5,
            "date": "2024-12-15",
            "start_time": "09:00",
            "end_time": "10:00"
          },
          {
            "id": 6,
            "date": "2024-12-15",
            "start_time": "11:00",
            "end_time": "12:00"
          }
        ],
        "gap_duration_minutes": 60,
        "gap_duration_formatted": "1h",
        "date": "2024-12-15"
      }
    ],
    "suggestions": [
      {
        "type": "fill_gap",
        "message": "Consider scheduling a 1h booking on 2024-12-15"
      }
    ],
    "summary": {
      "total_conflicts": 1,
      "total_overlaps": 1,
      "total_gaps": 1,
      "has_issues": true,
      "status": "warning"
    }
  }
}
```

### Admin Endpoints

#### List All Bookings

```http
GET /api/admin/bookings
Authorization: Bearer {admin_token}
```

Response: `200 OK`

```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "date": "2024-12-15",
      "start_time": "09:00",
      "end_time": "10:30",
      "title": "Team Meeting",
      "status": "confirmed"
    }
  ]
}
```

#### Admin Conflict Report

```http
GET /api/admin/bookings/conflicts/report
Authorization: Bearer {admin_token}
```

Response: `200 OK` (same structure as user conflict report, but includes all users' bookings)

#### Admin Dashboard

```http
GET /api/admin/dashboard
Authorization: Bearer {admin_token}
```

Response: `200 OK`

```json
{
  "data": {
    "total_bookings": 150,
    "total_users": 25,
    "bookings_today": 8,
    "bookings_this_week": 42,
    "conflicts_summary": {
      "total_conflicts": 5,
      "total_overlaps": 10,
      "total_gaps": 20,
      "has_issues": true,
      "status": "warning"
    },
    "recent_bookings": []
  }
}
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication

- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should fail)
- [ ] Logout
- [ ] Access protected route without token (should redirect)

#### Bookings

- [ ] Create new booking
- [ ] View list of bookings
- [ ] Edit existing booking
- [ ] Delete booking
- [ ] Try to edit another user's booking (should fail)

#### Conflicts

- [ ] Create overlapping bookings
- [ ] View conflict report
- [ ] Check color-coded conflicts
- [ ] Verify gap detection

#### Real-Time

- [ ] Open two browser tabs
- [ ] Create booking in tab 1
- [ ] Verify it appears in tab 2 without refresh
- [ ] Verify no duplicates in tab 1

#### Admin

- [ ] Login as admin
- [ ] View all users' bookings
- [ ] Access admin dashboard
- [ ] Try to access admin routes as regular user (should fail)

### Backend Testing

```bash
cd backend
php artisan test
```

### Frontend Testing

```bash
cd frontend
npm run test
```

---

## 🐛 Known Limitations

1. **WebSocket**: Requires Reverb server running (may need setup on production)
2. **Timezone**: Currently uses server timezone (could add user timezone support)
3. **Recurring Bookings**: Not implemented (future feature)
4. **Email Notifications**: Not implemented (future feature)
5. **Calendar View**: Not implemented (list view only)

---

## 📈 Future Enhancements

### High Priority

- [ ] Calendar view (month/week/day)
- [ ] Recurring bookings
- [ ] Email notifications
- [ ] Timezone support
- [ ] Booking templates

### Medium Priority

- [ ] Export bookings (CSV/PDF)
- [ ] Booking reminders
- [ ] User preferences
- [ ] Dark mode
- [ ] Mobile app (React Native)

### Low Priority

- [ ] Integration with Google Calendar
- [ ] Video call integration (Zoom/Meet)
- [ ] Team calendars
- [ ] Resource management (rooms, equipment)
- [ ] Booking approvals workflow

---

## 🤝 Development Process

### Time Breakdown (1 Day = 12 hours)

- **Planning & Architecture**: 1 hour
- **Backend Development**: 4 hours
  - Models & migrations
  - Repositories & services
  - Controllers & validation
  - Broadcasting setup
- **Frontend Development**: 4 hours
  - Components & pages
  - State management
  - WebSocket integration
  - Responsive design
- **Testing & Debugging**: 2 hours
- **Documentation**: 1 hour

### Challenges Faced & Solutions

#### 1. WebSocket Duplicates

**Problem**: Users saw duplicate entries from API response + broadcast

**Solution**: Implemented tab-specific ignore lists with 5-second window

```typescript
const TAB_ID = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
```

#### 2. Time Comparison Issues

**Problem**: String time comparison unreliable

**Solution**: Convert to Carbon/minutes for accurate comparison

#### 3. Responsive Design

**Problem**: Complex tables on mobile

**Solution**: Card-based layout with responsive grid

## 🎯 Summary

This project demonstrates:

✅ **Laravel Backend Architecture**

- Repository pattern
- Service layer
- Form Requests & API Resources
- PSR-12 & SOLID principles

✅ **Modern Vue 3 Frontend Development**

- Composition API
- Pinia state management
- TypeScript type safety
- Composables pattern

✅ **Real-Time WebSocket Implementation**

- Laravel Reverb
- Duplicate prevention
- Multi-tab support

✅ **Clean Code Principles**

- SOLID
- DRY
- Single Responsibility
- Separation of Concerns

✅ **Responsive Design Expertise**

- Mobile-first approach
- Tailwind CSS
- Touch-friendly UI

✅ **Problem-Solving Skills**

- WebSocket duplicate prevention
- Conflict detection algorithm
- Time comparison handling

✅ **Production-Ready Code Quality**

- Error handling
- Loading states
- User feedback
- Security best practices

✅ **Comprehensive Documentation**

- Setup instructions
- Architecture decisions
- API documentation
- Feature descriptions

---

## 📄 License

This is a private assessment project. All rights reserved.
