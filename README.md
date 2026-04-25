# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Supabase Auth Setup (Google + Magic Link)

This project now supports alternate login methods on the auth screen:

- `Continue with Google`
- `Send Magic Link`

To enable them, configure Supabase Dashboard first.

### 1. Add redirect URLs

In Supabase Dashboard, go to **Authentication -> URL Configuration** and add:

- Site URL: `http://localhost:5173`
- Redirect URL: `http://localhost:5173/auth`

Also add your production URL equivalent later (for example `https://your-domain.com/auth`).

### 2. Enable Google OAuth provider

In **Authentication -> Providers -> Google**:

- Toggle Google provider ON.
- Add your Google OAuth Client ID and Client Secret.
- In Google Cloud Console, include Supabase callback URL from the provider page.

### 3. Enable email login links (Magic Link)

In **Authentication -> Providers -> Email**:

- Keep Email provider enabled.
- Enable **Magic Link**.
- Optionally disable password sign-in if you want passwordless-only auth.

### 4. Environment variables

Create `.env.local` with:

```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. Run locally

```bash
npm install
npm run dev
```

Open `/auth` and use the Google or Magic Link buttons.
