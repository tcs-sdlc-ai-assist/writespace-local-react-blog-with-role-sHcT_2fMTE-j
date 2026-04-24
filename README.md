# WriteSpace

A modern blogging platform built with React where ideas come to life. Write, share, and discover stories that matter — all powered by client-side storage for instant performance and complete privacy.

## Tech Stack

- **React 18.3** with functional components and hooks
- **Vite 6.0** for fast development and optimized builds
- **React Router DOM 6.28** for client-side SPA routing
- **Tailwind CSS 3.4** with PostCSS and Autoprefixer
- **localStorage** for client-side data persistence
- **ES6+ JavaScript with JSX**

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Starts the Vite development server at `http://localhost:5173`.

### Build

```bash
npm run build
```

Outputs production-ready files to the `dist/` directory.

### Preview

```bash
npm run preview
```

Serves the production build locally for testing before deployment.

## Folder Structure

```
writespace-blog/
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── vercel.json                 # Vercel deployment config with SPA rewrites
├── CHANGELOG.md                # Project changelog
├── README.md                   # Project documentation
└── src/
    ├── main.jsx                # React app entry point
    ├── App.jsx                 # Root component with route definitions
    ├── index.css               # Tailwind CSS directives
    ├── components/
    │   ├── Avatar.jsx          # Role-based avatar component (👑 admin, 📖 user)
    │   ├── BlogCard.jsx        # Blog post preview card with truncated content
    │   ├── Navbar.jsx          # Authenticated navigation bar with mobile menu
    │   ├── ProtectedRoute.jsx  # Route guard for auth and admin-only routes
    │   ├── PublicNavbar.jsx    # Public-facing navigation bar
    │   ├── StatCard.jsx        # Dashboard statistic card with color themes
    │   └── UserRow.jsx         # User table row (desktop) and card (mobile)
    ├── pages/
    │   ├── AdminDashboard.jsx  # Admin overview with stats and recent posts
    │   ├── Home.jsx            # Blog listing page for authenticated users
    │   ├── LandingPage.jsx     # Public landing page with hero and features
    │   ├── LoginPage.jsx       # User login form
    │   ├── ReadBlog.jsx        # Full blog post view with edit/delete actions
    │   ├── RegisterPage.jsx    # User registration form
    │   ├── UserManagement.jsx  # Admin user CRUD interface
    │   └── WriteBlog.jsx       # Create and edit blog post form
    └── utils/
        ├── auth.js             # Authentication logic (login, register, session)
        └── storage.js          # localStorage CRUD for users, posts, and sessions
```

## Route Map

| Path             | Component          | Access          | Description                        |
| ---------------- | ------------------ | --------------- | ---------------------------------- |
| `/`              | `LandingPage`      | Public          | Landing page with hero and features |
| `/login`         | `LoginPage`        | Public          | User sign-in form                  |
| `/register`      | `RegisterPage`     | Public          | User registration form             |
| `/blogs`         | `Home`             | Authenticated   | All blog posts listing             |
| `/write`         | `WriteBlog`        | Authenticated   | Create a new blog post             |
| `/write?edit=:id`| `WriteBlog`        | Authenticated   | Edit an existing blog post         |
| `/blog/:id`      | `ReadBlog`         | Authenticated   | Read a single blog post            |
| `/admin`         | `AdminDashboard`   | Admin only      | Platform overview and stats        |
| `/admin/users`   | `UserManagement`   | Admin only      | Create, view, and delete users     |
| `*`              | Redirect to `/`    | —               | Catch-all for unknown routes       |

## Features

### Authentication & Authorization

- Login and registration with form validation
- Role-based access control with two roles: **admin** and **user**
- Protected routes via the `ProtectedRoute` component
- Session persistence via localStorage
- Default admin account: username `admin`, password `admin`

### Blog Management

- Create new posts with title (100 character limit) and content (2000 character limit)
- Read posts with full content display
- Edit posts (author or admin)
- Delete posts with confirmation modal (author or admin)
- Chronological post listing with truncated content previews
- Character count indicators on the write/edit form

### Admin Dashboard

- Platform statistics: total posts, total users, admin count, user count
- Recent posts list with quick edit and delete actions
- Quick action buttons for writing posts and managing users

### User Management (Admin)

- Create new users with display name, username, password, and role selection
- View all users in a responsive table (desktop) and card (mobile) layout
- Delete non-admin users with confirmation modal
- Protection against deleting admin accounts and the current user

### Responsive UI

- Mobile-first design with Tailwind CSS
- Collapsible mobile navigation menu
- Responsive grid layouts for blog cards and stat cards
- Consistent indigo/violet color palette with hover states and transitions

## Environment Notes

- **No backend required** — all data is stored client-side in localStorage
- Storage keys: `ws_users` (users), `ws_posts` (posts), `ws_session` (session)
- Clearing browser localStorage will reset all application data
- UUID generation uses `crypto.randomUUID()` with a fallback for older browsers

## Deployment

### Vercel

The project includes a `vercel.json` configuration that rewrites all routes to `index.html` for proper SPA client-side routing support.

1. Push the repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Vercel auto-detects the Vite framework and applies the correct build settings
4. Deploy — the `vercel.json` rewrites handle client-side routing automatically

### Other Platforms

For any static hosting platform, ensure:

1. Run `npm run build` to generate the `dist/` directory
2. Serve the contents of `dist/`
3. Configure a fallback/rewrite rule so all routes serve `index.html`

## License

Private