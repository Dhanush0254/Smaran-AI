# SmaranAI — Full Stack Internship Assessment

A complete full-stack web application built with **React + Vite + Supabase** demonstrating authentication, protected API endpoints, and modern UI design.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20Edge-green?logo=supabase)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-blue?logo=tailwindcss)

---

## 📁 Project Structure

```
SmaranAI/
├── public/                          # Static assets
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx            # Main dashboard page
│   │   ├── DataCard.tsx             # Individual data record card
│   │   ├── ErrorState.tsx           # Error display component
│   │   ├── Header.tsx               # Dashboard header with profile & logout
│   │   ├── LoadingState.tsx         # Shimmer skeleton loader
│   │   ├── LoginPage.tsx            # Google OAuth login page
│   │   └── UserProfileCard.tsx      # User profile information card
│   ├── hooks/
│   │   ├── useAuth.ts               # Auth state management hook
│   │   └── useSampleData.ts         # Data fetching hook
│   ├── lib/
│   │   └── supabaseClient.ts        # Supabase client singleton
│   ├── services/
│   │   └── supabaseService.ts       # API service layer
│   ├── App.tsx                      # Root component
│   ├── main.tsx                     # Application entry point
│   ├── index.css                    # Tailwind CSS + design system
│   └── vite-env.d.ts                # TypeScript env declarations
├── supabase/
│   ├── functions/
│   │   └── get-data/
│   │       └── index.ts             # Protected Edge Function
│   └── sql/
│       └── setup.sql                # Database setup script
├── .env                             # Environment variables (not committed)
├── .env.example                     # Example env file
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+
- npm 9+
- Supabase account ([supabase.com](https://supabase.com))
- Google Cloud Console account ([console.cloud.google.com](https://console.cloud.google.com))

---

### 1. Supabase Project Setup

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Set a project name, strong password, and select a region
4. Wait for the project to be created (~2 minutes)
5. Go to **Settings → API** and copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### 2. Database Setup

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Paste the contents of [`supabase/sql/setup.sql`](supabase/sql/setup.sql)
4. Click **"Run"**
5. Verify: Go to **Table Editor** → `sample_data` should have 5 records

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services → Credentials**
4. Click **"Create Credentials" → "OAuth Client ID"**
5. Configure the **OAuth consent screen** if prompted:
   - User Type: External
   - Add required scopes: `email`, `profile`, `openid`
   - Add test users (your email)
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Authorized redirect URI:
     ```
     https://<YOUR_PROJECT_REF>.supabase.co/auth/v1/callback
     ```
7. Copy the **Client ID** and **Client Secret**

### 4. Enable Google Auth in Supabase

1. Go to **Authentication → Providers → Google**
2. Toggle **Enabled**
3. Enter your Google **Client ID** and **Client Secret**
4. Click **Save**

### 5. Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 6. Install & Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚡ Deploying the Edge Function

### Option A: Supabase Dashboard (Easiest)

1. Go to **Edge Functions** in your Supabase dashboard
2. Click **"New Function"**
3. Name it `get-data`
4. Paste the contents of [`supabase/functions/get-data/index.ts`](supabase/functions/get-data/index.ts)
5. Click **Deploy**

### Option B: Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the Edge Function
supabase functions deploy get-data
```

---

## 🧪 Postman Testing

### 1. Get Access Token

1. Login to the app via Google
2. Open browser **DevTools → Console**
3. Run:
   ```js
   const { data } = await window.__supabase.auth.getSession();
   console.log(data.session.access_token);
   ```
   
   **Alternative**: Open DevTools → **Application** tab → **Local Storage** → look for `sb-*-auth-token` → copy `access_token` from the JSON value.

### 2. Test Successful Response

- **Method**: `POST`
- **URL**: `https://voobdgjqmkdxnslaprbx.supabase.co/functions/v1/get-data`
- **Headers**:
  | Key | Value |
  |-----|-------|
  | `Authorization` | `Bearer <your_access_token>` |
  | `Content-Type` | `application/json` |

- **Expected Response** (200 OK):
  ```json
  {
    "data": [
      {
        "id": 1,
        "title": "Getting Started with Supabase",
        "description": "Supabase is an open-source..."
      }
    ],
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    }
  }
  ```

### 3. Test Unauthorized Response

- Same URL and method
- **Remove** the `Authorization` header (or use an invalid token)
- **Expected Response** (401 Unauthorized):
  ```json
  {
    "error": "Unauthorized: Missing Authorization header",
    "data": []
  }
  ```

### 4. Test Expired Token

- Use an old/expired token in the `Authorization` header
- **Expected Response** (401 Unauthorized):
  ```json
  {
    "error": "Unauthorized: Invalid or expired token",
    "data": []
  }
  ```

---

## 🎬 Demo Video Checklist

Use this checklist when recording your demo video:

- [ ] **Show the Login Page** — Clean UI with "Continue with Google" button
- [ ] **Click "Continue with Google"** — Google OAuth popup appears
- [ ] **Complete Google Login** — Redirect back to dashboard
- [ ] **Show User Profile** — Name, email, and avatar displayed
- [ ] **Show Data Records** — 5 sample records loaded from Edge Function
- [ ] **Show Loading State** — Refresh data and show shimmer loaders
- [ ] **Show Error Handling** — Demonstrate error state (optional)
- [ ] **Click Logout** — User is logged out, redirected to login page
- [ ] **Show Postman Test** — Successful API call with valid token
- [ ] **Show Postman Unauthorized** — API returns 401 without token
- [ ] **Show Code Structure** — Clean folder structure in VS Code
- [ ] **Show Environment Variables** — `.env` file, no hardcoded secrets

---

## 🔧 Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Vite 8 | Build Tool & Dev Server |
| TypeScript | Type Safety |
| Tailwind CSS v4 | Styling |
| Supabase | Backend (Auth + DB + Edge Functions) |
| Supabase Auth | Google OAuth Authentication |
| Supabase Edge Functions | Protected API Endpoint |
| PostgreSQL | Database (via Supabase) |

---

## 📋 Architecture

```
┌─────────────────────┐     ┌──────────────────────┐
│   React Frontend    │────▶│  Supabase Auth       │
│   (Vite + Tailwind) │     │  (Google OAuth)      │
└────────┬────────────┘     └──────────────────────┘
         │                           │
         │ Authorization:            │ JWT Token
         │ Bearer <token>            │
         ▼                           ▼
┌─────────────────────┐     ┌──────────────────────┐
│  Edge Function      │────▶│  PostgreSQL DB       │
│  (get-data)         │     │  (sample_data table) │
│  - Verify JWT       │     └──────────────────────┘
│  - Fetch data       │
│  - Return JSON      │
└─────────────────────┘
```

---

## 📄 License

This project is part of a Full Stack Internship Assessment.
