# Changelog

All notable changes to the WriteSpace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-01

### Added

- **Public Landing Page**
  - Hero section with gradient banner and call-to-action buttons
  - Feature highlights showcasing platform capabilities (Write & Publish, Role-Based Access, Instant & Local)
  - Latest posts preview section for unauthenticated visitors
  - Responsive footer with navigation links

- **Authentication**
  - Login page with username and password validation
  - Registration page with display name, username, password, and password confirmation
  - Automatic redirect for already-authenticated users
  - Session persistence via localStorage
  - Logout functionality with session cleanup

- **Role-Based Access Control**
  - Two roles: `admin` and `user`
  - Protected routes via `ProtectedRoute` component
  - Admin-only routes for dashboard and user management
  - Hardcoded default admin account (`admin` / `admin`)
  - Role-based avatar indicators (👑 for admin, 📖 for user)
  - Role badges displayed in navigation and user listings

- **Blog CRUD Operations**
  - Create new blog posts with title (100 char limit) and content (2000 char limit)
  - Read individual blog posts with full content display
  - Edit existing posts with permission checks (author or admin)
  - Delete posts with confirmation modal (author or admin)
  - Character count indicators on write/edit form
  - Chronological post listing on the home page
  - Truncated content previews on blog cards

- **Admin Dashboard**
  - Platform overview with stat cards (total posts, total users, admin count, user count)
  - Recent posts list with quick edit and delete actions
  - Quick action buttons for writing posts and managing users
  - Gradient banner with personalized welcome message

- **User Management (Admin)**
  - Create new users with display name, username, password, and role selection
  - View all platform users in a responsive table (desktop) and card (mobile) layout
  - Delete non-admin users with confirmation modal
  - Protection against deleting admin accounts and current user
  - Success and error messaging for user operations

- **localStorage Persistence**
  - All data stored client-side in localStorage
  - Separate storage keys for users (`ws_users`), posts (`ws_posts`), and session (`ws_session`)
  - Graceful error handling for storage read/write failures
  - UUID generation for user and post identifiers

- **Responsive Tailwind CSS UI**
  - Mobile-first responsive design across all pages
  - Collapsible mobile navigation menu
  - Responsive grid layouts for blog cards and stat cards
  - Desktop table / mobile card hybrid layout for user management
  - Consistent design system with indigo/violet color palette
  - Hover states, transitions, and shadow effects throughout

- **SPA Routing**
  - Client-side routing via React Router v6
  - Route definitions for landing, login, register, blogs, write, edit, read, admin dashboard, and user management
  - Catch-all redirect to landing page for unknown routes
  - Navigation guards for authenticated and admin-only routes

- **Vercel Deployment**
  - Vercel configuration with SPA rewrite rules
  - All routes rewritten to `index.html` for client-side routing support

### Technical Stack

- React 18.3 with Vite 6.0
- React Router DOM 6.28
- Tailwind CSS 3.4 with PostCSS and Autoprefixer
- ES6+ JavaScript with JSX
- localStorage for client-side data persistence