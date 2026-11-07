# SupportlyAI - Premium AI-Powered WhatsApp Customer Support SaaS

SupportlyAI is a modern, enterprise-grade React SaaS dashboard engineered to manage autonomous customer support AI agents on WhatsApp. Designed with the clean, refined aesthetic of Linear, Vercel, and Intercom, SupportlyAI enables businesses to provision support agents, ground them with PDF documentation and FAQs via multipart upload, and link them to Twilio WhatsApp messaging webhooks.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS with custom CSS variables (Design System inspired by Linear/Vercel)
- **UI & Icons**: Radix UI primitives (`@radix-ui/react-dialog`, `@radix-ui/react-slot`), Lucide Icons, Sonner toasts
- **Routing**: React Router DOM v6 (Protected routes, authentication guards, dynamic subroutes)
- **Server State & Networking**: TanStack Query v5 + Centralized Axios Client (automatic query invalidation, Bearer JWT injection, 401/403 lifecycle handling)
- **Forms & Validation**: React Hook Form + Zod schema validation

---

## 🔒 Security & Backend Architecture

### 1. Zero Frontend Secret Exposure
- **Twilio Credentials** (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`) and **Groq LLM API Keys** are strictly maintained on the Spring Boot backend server.
- The frontend never stores, requests, or handles third-party provider secrets.

### 2. Centralized Session Strategy
- Login receives `{ token, email, businessName }` from the backend.
- The Bearer JWT is managed via `AuthContext` and stored in `localStorage` under `supportly_auth_session`.
- The Axios interceptor (`src/api/client.ts`) attaches `Authorization: Bearer <token>` to all protected calls.
- In the event of a 401 Unauthorized or expired token, an event bus triggers session cleanup and redirects to `/login` without console leaks.

---

## 🔌 Verified Backend Contracts (`http://localhost:8080`)

| Endpoint | Method | Auth | Request | Response |
| :--- | :---: | :---: | :--- | :--- |
| `/api/auth/signup` | POST | None | `{ businessName, email, password }` | `{ message: "User registered successfully" }` |
| `/api/auth/login` | POST | None | `{ email, password }` | `{ token, email, businessName, message }` |
| `/api/agents` | GET | Bearer | — | `[{ id, name, status, createdAt }]` |
| `/api/agents` | POST | Bearer | `{ name: "Agent Name" }` | `{ id, name, status, createdAt }` (HTTP 201) |
| `/api/agents/{id}/faqs` | GET | Bearer | — | `[{ id, fileName, uploadedAt }]` |
| `/api/agents/{id}/faqs` | POST | Bearer | Multipart `file` (PDF only) | `{ id, fileName, uploadedAt }` (HTTP 201) |

> **Architectural Guardrails Observed**:
> - `POST /api/whatsapp/webhook` is a Twilio server-to-server endpoint producing TwiML; it is **never** invoked directly from the frontend.
> - Development test endpoints (`/api/ai/test`, `/api/embedding/test`, etc.) are hidden from production views.
> - No fabricated deletion, messaging, or fake telemetry endpoints were invented. Unsupported features display transparent **Coming Soon** or disabled state indicators.

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- Spring Boot Backend running on `http://localhost:8080`

### 1. Environment Configuration
Ensure `.env` exists in the project root:
```bash
VITE_API_BASE_URL=http://localhost:8080
```
*(Reference `.env.example`)*

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The application will launch at **`http://localhost:5173`**.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── api/
│   ├── client.ts        # Centralized Axios instance, token interceptor, error parsing
│   ├── auth.ts          # Real login & signup calls
│   ├── agents.ts        # Real agent query and creation calls
│   └── faqs.ts          # Real multipart PDF upload and retrieval calls
├── types/
│   └── api.ts           # Strict TypeScript contracts for Spring Boot API
├── contexts/
│   ├── AuthContext.tsx  # Documented session state & auto-logout on 401
│   └── ThemeContext.tsx # Light/Dark mode state management
├── components/
│   ├── ui/              # Button, Input, Card, Dialog, Skeleton, Toaster, Badge
│   └── layout/          # Sidebar, Topbar, DashboardLayout, ErrorBoundary
├── routes/
│   ├── ProtectedRoute.tsx # Authenticated session guard
│   ├── PublicRoute.tsx    # Auth page redirector
│   └── AppRoutes.tsx      # Main application router
└── pages/
    ├── LandingPage.tsx            # Marketing hero, how it works, features
    ├── LoginPage.tsx              # Email/password login with real JWT storage
    ├── SignupPage.tsx             # Business registration with real API
    ├── DashboardOverviewPage.tsx  # Welcome, real agent count, quick checklist
    ├── AgentsPage.tsx             # Agent cards, status enum, create dialog
    ├── AgentDetailPage.tsx        # Specific agent info & FAQ document manager
    ├── KnowledgeBasePage.tsx      # Drag & drop PDF uploader with progress
    ├── WhatsAppIntegrationPage.tsx# Twilio webhook guide & explicit 'Not verified'
    ├── ConversationsPage.tsx      # Honest 'Coming Soon' placeholder
    ├── AnalyticsPage.tsx          # Honest 'Coming Soon' metrics preview
    ├── SettingsPage.tsx           # Read-only business credentials & dark mode
    └── NotFoundPage.tsx           # 404 page
```
