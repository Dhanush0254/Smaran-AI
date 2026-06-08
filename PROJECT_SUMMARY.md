# Secure Data Pipeline: Project Summary & Technical Review

This document provides a comprehensive, interview-ready summary of the Secure Data Pipeline assessment project. It covers the architecture, implementation details, challenges overcome, and a suggested workflow for a demonstration.

---

## 1. Project Overview

**Objective**  
To build a secure, full-stack data pipeline demonstrating modern authentication, serverless edge compute, and a polished frontend. The core requirement was to ensure that a database table can *only* be accessed via a secure, authenticated Edge Function, rather than direct client-side queries.

**Technologies Used**
*   **Frontend**: React 19, Vite, TypeScript, Tailwind CSS v4 (Shadcn/Vercel aesthetic).
*   **Backend / Serverless**: Supabase Edge Functions (Deno).
*   **Database**: PostgreSQL (Supabase).
*   **Authentication**: Supabase Auth (Google OAuth).
*   **Deployment**: Render (Frontend), Supabase Platform (Backend/DB).

---

## 2. Database Layer

**Schema**
A simple, focused table named `sample_data` was created using the following SQL:
```sql
CREATE TABLE sample_data (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

**Dummy Records**
Five realistic dummy records covering topics like "Getting Started with Supabase", "React + Vite Setup", and "Edge Functions Overview" were inserted to provide immediate visual feedback in the UI.

**Security & RLS (Row Level Security)**
*   RLS was enabled on the `sample_data` table.
*   **Crucial Security Decision**: *No client-side policies were created.* The table is entirely locked down from the public web. It can only be read by the Supabase Edge Function utilizing the authenticated user's JWT.

---

## 3. Authentication Flow

**Google OAuth Setup**
*   Configured an OAuth Consent Screen and Web Application Credentials in the Google Cloud Console.
*   Linked the generated Client ID and Client Secret to the Supabase Auth dashboard.
*   Configured the exact redirect URI (`https://[PROJECT_ID].supabase.co/auth/v1/callback`).

**Integration & Validation**
*   The frontend utilizes `@supabase/supabase-js` to trigger the OAuth flow.
*   Upon successful Google login, Supabase redirects the user back to the application and securely stores the session (containing the Access Token / JWT) in local storage.

---

## 4. Edge Function (`get-data`)

**Request Flow**
The serverless function (written in TypeScript/Deno) acts as the gatekeeper to the database.

1.  **CORS Handling**: Intercepts `OPTIONS` preflight requests from the browser and returns standard `Access-Control-Allow-*` headers with a `200 OK` status.
2.  **Authorization**: Extracts the `Authorization: Bearer <token>` header from the incoming `GET` request.
3.  **Validation**: Passes the JWT to `supabase.auth.getUser()`. If the token is missing, expired, or tampered with, the function immediately returns a `401 Unauthorized`.
4.  **Data Fetching**: Only after successful validation does the function query the `sample_data` table and return the JSON payload.

---

## 5. Frontend Architecture

**Folder Structure**
The React application follows a modular, separation-of-concerns pattern:
*   `/src/components`: UI elements (`Dashboard`, `LoginPage`, `Header`, `DataCard`).
*   `/src/hooks`: Custom React hooks (`useAuth`, `useSampleData`).
*   `/src/services`: Supabase client initialization and auth helper functions.

**State Management & Data Fetching**
*   **`useAuth`**: Subscribes to Supabase's `onAuthStateChange` listener to automatically sync the user's session state across the app.
*   **`useSampleData`**: A custom hook responsible for retrieving the current user's session token, making the `fetch()` call to the Edge Function, and managing `loading`, `error`, and `data` states.

**UI Design**
*   Implemented a highly professional, minimalistic "Vercel / Shadcn" aesthetic.
*   Utilizes a light mode theme with subtle borders, soft shadows, and strict grid alignments.

---

## 6. Complete API Flow (Login to Display)

1.  **User Action**: Clicks "Continue with Google".
2.  **Provider Auth**: User authenticates via Google's secure popup.
3.  **Token Generation**: Supabase issues a secure JWT and redirects to the app.
4.  **UI State Update**: `useAuth` detects the session and mounts the `Dashboard` component.
5.  **Data Request**: `useSampleData` reads the JWT and sends an HTTP GET request to `https://[PROJECT_ID].supabase.co/functions/v1/get-data`, attaching the JWT in the `Authorization` header.
6.  **Edge Verification**: The Edge Function verifies the JWT.
7.  **Response**: The database returns the 5 dummy records to the Edge Function, which forwards them to the client.
8.  **Rendering**: The React components iterate over the data array and render `DataCard` components.

---

## 7. Postman Verification (Security Testing)

To prove the architecture is secure, the endpoint was validated outside the browser:

*   **Unauthorized Request**: Sending a `GET` request to the Edge Function without a token (or with a fake token) successfully results in a `401 Unauthorized` HTTP status and the JSON payload: `{"error": "Unauthorized: Missing Authorization header", "data": []}`.
*   **Authorized Request**: Extracting the real JWT from the browser's local storage and pasting it into Postman's "Bearer Token" authorization tab successfully returns a `200 OK` and the array of database records.

---

## 8. Challenges Faced & Resolutions

**1. Google OAuth Credential Mismatch**
*   *Issue*: Initial login attempts resulted in an "Unable to exchange external code" error.
*   *Resolution*: Identified a discrepancy in the copied Client Secret. The issue was resolved by generating a fresh set of credentials in Google Cloud and carefully re-pasting them into the Supabase Dashboard.

**2. Strict CORS Policies on Edge Functions**
*   *Issue*: The browser blocked the frontend from reading the Edge Function's response due to missing CORS headers on error paths.
*   *Resolution*: Refactored the Edge Function to use a centralized `jsonResponse()` helper function. This ensured that *every* response (whether `200 OK`, `401 Unauthorized`, or `500 Error`) consistently returned the required `Access-Control-Allow-Origin: *` headers.

---

## 9. Key Learnings

*   **Serverless Gatekeeping**: Directly querying a database from the frontend (even with RLS) isn't always the right pattern. Putting an Edge Function in front of the database allows for custom server-side logic, rate limiting, and stricter payload sanitization.
*   **Deno in Supabase**: Understanding the execution environment of Supabase Edge Functions (Deno instead of Node.js) and how it requires explicit CORS handling for browser-based fetch requests.
*   **Tailwind v4 Paradigms**: Adapting to the new `@theme` configuration and standard CSS imports in Vite.

---

## 10. Technical Highlights & Best Practices

*   **Security First**: The architecture strictly enforces "Least Privilege". The database is completely opaque to the internet; it only talks to the Edge Function.
*   **Custom Hooks**: Abstracting fetch logic into `useSampleData` keeps the UI components clean and strictly focused on rendering.
*   **Graceful Degradation**: The UI robustly handles Loading states, Error states (specifically parsing and displaying 401 Unauthorized elegantly), and Empty states.

---

## 11. Suggested Demo Video Flow

For an interview or technical demonstration, follow this exact sequence:

1.  **The Code Walkthrough (1 min)**
    *   *Show*: `supabase/functions/get-data/index.ts`.
    *   *Talk Track*: "Notice how we handle CORS preflight requests first, then extract the Bearer token. We manually verify the token using `supabase.auth.getUser()`. If it fails, we reject the request. We don't query the database directly from the frontend."
2.  **The Unauthenticated Experience (30 sec)**
    *   *Show*: The clean Login Page.
    *   *Talk Track*: "The user must authenticate via Google OAuth. The dashboard route is entirely protected."
3.  **The Login Flow (30 sec)**
    *   *Show*: Click "Continue with Google", complete the flow, and land on the Dashboard.
    *   *Talk Track*: "Upon login, Supabase provisions a JWT. The React app immediately uses this JWT to request data from our Edge Function."
4.  **The UI & Network Tab (1 min)**
    *   *Show*: Open the Chrome DevTools Network Tab. Refresh the page. Click the `get-data` request.
    *   *Talk Track*: "As you can see in the Request Headers, we are passing the `Authorization: Bearer` token. The Edge Function validates it and returns our database records, which are then rendered in this Vercel-style grid."
5.  **The Security Proof (Postman) (1 min)**
    *   *Show*: Open Postman. Hit the Edge Function URL without a token. Show the `401 Unauthorized` response.
    *   *Talk Track*: "To prove the backend is secure, hitting the endpoint directly fails. Our data pipeline is completely locked down and requires valid OAuth claims."
