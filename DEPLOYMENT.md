# Deployment Guide

This document covers deployment configuration, hosting setup, and CI/CD notes for the WriteSpace blogging platform.

## Table of Contents

- [Overview](#overview)
- [Build Configuration](#build-configuration)
- [Vercel Deployment](#vercel-deployment)
  - [Automatic Deployment](#automatic-deployment)
  - [Manual Deployment](#manual-deployment)
  - [vercel.json Configuration](#verceljson-configuration)
  - [SPA Rewrite Rules](#spa-rewrite-rules)
- [Environment Variables](#environment-variables)
- [Other Hosting Platforms](#other-hosting-platforms)
  - [Netlify](#netlify)
  - [GitHub Pages](#github-pages)
  - [Cloudflare Pages](#cloudflare-pages)
  - [Self-Hosted / Static Server](#self-hosted--static-server)
- [CI/CD Notes](#cicd-notes)
- [Troubleshooting](#troubleshooting)

---

## Overview

WriteSpace is a fully client-side single-page application (SPA) built with React and Vite. It has **no backend server** and **no database** — all data is persisted in the browser's `localStorage`. This means deployment is as simple as serving static files from any hosting platform.

**Key deployment characteristics:**

- Static site output (HTML, CSS, JS)
- No server-side rendering required
- No API endpoints or backend services
- No environment variables required
- All routes must resolve to `index.html` for client-side routing to work

---

## Build Configuration

### Prerequisites

- Node.js 18+ and npm

### Build Command

```bash
npm run build
```

This runs `vite build`, which outputs production-ready static files to the `dist/` directory.

### Preview Build Locally

```bash
npm run preview
```

This serves the production build locally at `http://localhost:4173` for testing before deployment.

### Build Output

```
dist/
├── index.html          # Entry point for the SPA
├── assets/
│   ├── index-[hash].js # Bundled JavaScript
│   └── index-[hash].css # Bundled CSS (Tailwind)
└── vite.svg            # Favicon
```

The `dist/` directory contains everything needed for deployment. No additional build steps or post-processing is required.

---

## Vercel Deployment

[Vercel](https://vercel.com) is the recommended hosting platform for WriteSpace. It auto-detects Vite projects and applies the correct build settings out of the box.

### Automatic Deployment

1. Push the WriteSpace repository to GitHub (or GitLab / Bitbucket).
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the repository from your Git provider.
4. Vercel auto-detects the **Vite** framework and pre-fills the build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **"Deploy"**.
6. Vercel builds the project and assigns a production URL (e.g., `https://your-project.vercel.app`).

After the initial deployment, every push to the default branch (e.g., `main`) triggers an automatic redeployment. Pull requests generate preview deployments with unique URLs.

### Manual Deployment

If you prefer to deploy without connecting a Git repository, use the Vercel CLI:

```bash
# Install the Vercel CLI globally
npm install -g vercel

# Deploy from the project root
vercel

# Deploy to production
vercel --prod
```

The CLI walks you through project setup on first run and deploys the `dist/` output.

### vercel.json Configuration

The project includes a `vercel.json` file at the repository root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This file configures Vercel's edge network to handle routing for the SPA.

### SPA Rewrite Rules

Since WriteSpace uses React Router for client-side routing, all navigation happens in the browser. When a user visits a deep link like `/blog/abc123` or `/admin/users`, the server must return `index.html` instead of a 404 error. React Router then reads the URL and renders the correct page component.

The rewrite rule in `vercel.json` does exactly this:

| Rule | Behavior |
| --- | --- |
| `"source": "/(.*)"` | Matches every incoming request path |
| `"destination": "/index.html"` | Serves `index.html` for all matched paths |

**How it works in practice:**

1. User navigates to `https://your-app.vercel.app/admin/users`
2. Vercel receives the request for `/admin/users`
3. The rewrite rule maps `/admin/users` → `/index.html`
4. The browser loads `index.html`, which loads the bundled JS
5. React Router matches `/admin/users` and renders the `UserManagement` component

Without this rewrite rule, refreshing or directly visiting any route other than `/` would return a 404 error.

**Note:** Static assets (JS, CSS, images) in the `dist/assets/` directory are served directly and are not affected by the rewrite rule, because Vercel serves existing files before applying rewrites.

---

## Environment Variables

WriteSpace does **not** require any environment variables. There are:

- No API keys
- No backend URLs
- No database connection strings
- No secret tokens
- No feature flags

All application data is stored client-side in `localStorage` using the following keys:

| Storage Key | Purpose |
| --- | --- |
| `ws_users` | Registered user accounts |
| `ws_posts` | Blog post data |
| `ws_session` | Current authenticated session |

If you need to add environment variables in the future (e.g., for analytics), Vite supports `.env` files with the `VITE_` prefix:

```bash
# .env
VITE_APP_TITLE=WriteSpace
```

Access in code via `import.meta.env.VITE_APP_TITLE`. See the [Vite environment variables documentation](https://vitejs.dev/guide/env-and-mode.html) for details.

---

## Other Hosting Platforms

Since WriteSpace is a static SPA, it can be deployed to any platform that serves static files. The only requirement is configuring a fallback/rewrite rule so all routes serve `index.html`.

### Netlify

1. Push the repository to GitHub.
2. Import the project in [Netlify](https://www.netlify.com).
3. Set the build settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. Add a `netlify.toml` file to the project root (or configure in the Netlify UI):

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

5. Deploy.

### GitHub Pages

1. Install the `gh-pages` package:

```bash
npm install --save-dev gh-pages
```

2. Add a `homepage` field to `package.json` and a deploy script:

```json
{
  "homepage": "https://<username>.github.io/<repo-name>",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Set the `base` option in `vite.config.js` to match the repository name:

```js
export default defineConfig({
  base: '/<repo-name>/',
  plugins: [react()],
})
```

4. Add a `404.html` file to the `public/` directory that redirects to `index.html` (GitHub Pages does not support rewrite rules natively). A common approach is to copy `index.html` as `404.html` in a post-build step.

5. Run `npm run deploy`.

**Note:** GitHub Pages has limitations with SPA routing. Consider using a hash router (`HashRouter` from React Router) as an alternative if the `404.html` redirect approach is not acceptable.

### Cloudflare Pages

1. Push the repository to GitHub.
2. Import the project in [Cloudflare Pages](https://pages.cloudflare.com).
3. Set the build settings:
   - **Build Command:** `npm run build`
   - **Build Output Directory:** `dist`
4. Cloudflare Pages automatically handles SPA routing — no additional configuration is needed. All requests that don't match a static file are served `index.html` by default.
5. Deploy.

### Self-Hosted / Static Server

If you are serving the `dist/` directory from your own server (e.g., Nginx, Apache, Caddy), configure a fallback rule:

**Nginx:**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache (.htaccess):**

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

**Caddy (Caddyfile):**

```
your-domain.com {
    root * /path/to/dist
    file_server
    try_files {path} /index.html
}
```

---

## CI/CD Notes

### Vercel Auto-Deploy

When the repository is connected to Vercel:

- **Production deployments** are triggered automatically on every push to the default branch (e.g., `main` or `master`).
- **Preview deployments** are created automatically for every pull request, each with a unique URL for testing.
- **Instant rollbacks** are available from the Vercel dashboard — click any previous deployment to roll back.

No additional CI/CD pipeline configuration (e.g., GitHub Actions) is required when using Vercel.

### Custom CI/CD Pipeline

If you prefer to use a custom CI/CD pipeline (e.g., GitHub Actions), here is a minimal workflow example:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 18

      - run: npm install
      - run: npm run build

      # Deploy using Vercel CLI
      - run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

Store `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` as GitHub repository secrets.

### Build Validation

Before deploying, you can validate the build locally:

```bash
# Install dependencies
npm install

# Run the production build
npm run build

# Preview the build output
npm run preview
```

Verify that:

1. The build completes without errors.
2. All routes work correctly when navigating directly (e.g., `/blogs`, `/admin`, `/blog/:id`).
3. Client-side navigation between pages works as expected.
4. The application loads correctly at the root URL (`/`).

---

## Troubleshooting

### Routes return 404 on page refresh

**Cause:** The hosting platform is not configured to serve `index.html` for all routes.

**Fix:** Ensure the SPA rewrite/fallback rule is configured. See the platform-specific instructions above.

### Blank page after deployment

**Cause:** The `base` path in `vite.config.js` does not match the deployment URL path.

**Fix:** If deploying to a subdirectory (e.g., `https://example.com/my-app/`), set the `base` option in `vite.config.js`:

```js
export default defineConfig({
  base: '/my-app/',
  plugins: [react()],
})
```

For root-level deployments (e.g., `https://example.com/`), no `base` configuration is needed (the default `/` is correct).

### localStorage data not persisting

**Cause:** The browser may be in private/incognito mode, or localStorage is disabled.

**Fix:** This is a browser-level limitation, not a deployment issue. Ensure users are not in private browsing mode. WriteSpace requires localStorage to function.

### Assets not loading (JS/CSS 404)

**Cause:** The build output directory is not configured correctly on the hosting platform.

**Fix:** Ensure the hosting platform's publish/output directory is set to `dist` (not `build`, `public`, or the project root).