# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build
npm run preview   # Preview production build locally
```

For the Supabase Edge Function (`supabase/functions/send-report/`):
```bash
npx supabase link --project-ref ehyjjvhfmbemtkogblne
npx supabase functions deploy send-report
```

## Environment Variables

Create `.env.local` with:
```
VITE_GEMINI_API_KEY=       # Google Gemini API key (optional - falls back to mock report)
VITE_SUPABASE_URL=         # Supabase project URL
VITE_SUPABASE_ANON_KEY=    # Supabase anon key
VITE_N8N_WEBHOOK_URL=      # n8n webhook (optional - has hardcoded fallback)
VITE_RESEND_API_KEY=       # Resend API key for email (passed to Edge Function)
```

## Architecture

**Stack:** React 19 + TypeScript + Vite, Tailwind CSS, Framer Motion, Recharts, jsPDF

### App State Machine (`App.tsx`)
The entire app flows through 4 states: `landing → form → processing → booking`. State is managed in `App.tsx` via `useState<AppState>`. No router is used — everything is conditional rendering.

### Data Flow
1. User fills lead info on `LandingPage` → fires `lead_start` webhook event
2. User completes `AuditForm` (15 questions) → `calculateResult()` in `App.tsx` scores responses
3. `processing` state briefly shown → data written to Supabase + `audit_complete` webhook fired
4. `BookingScreen` shown: AI report generated via Gemini, Cal.com embed loaded, emails auto-sent to lead + admin

### Key Files
- `types.ts` — all shared types (`Question`, `UserResponse`, `AuditResult`, `LeadData`)
- `constants.tsx` — the 15 audit questions (`QUESTIONS` array) and `CAL_COM_LINK`
- `services/geminiService.ts` — calls Gemini 1.5 Flash; has full mock fallback when no API key
- `services/storageService.ts` — inserts into Supabase `audit_leads` table
- `services/webhookService.ts` — POSTs to n8n webhook on lead start and audit complete
- `services/emailService.ts` — invokes `send-report` Supabase Edge Function via `supabase.functions.invoke`
- `supabase/functions/send-report/index.ts` — Deno Edge Function using Resend to send HTML emails

### Scoring System
Questions are typed as `scored`, `select`, `multiselect`, or `text`. Only `scored` questions (Q6, Q9, Q10, Q12, Q13, Q15) and `select` questions (Q8, Q11) contribute to the score. Max 5 points per scored question (8 scored questions = 40 max). Score maps to: Low (<40%), Medium (40–69%), High (≥70%). Pillar scores are grouped by `Question.pillar` (enum: Strategy, Data, Processes, People, Tools).

### Supabase
- Database table: `audit_leads` (columns: `name`, `email`, `business_name`, `responses`, `audit_result`, `ai_report`)
- Edge Function: `send-report` — receives `{ email, name, businessName, report, score, level, resendApiKey }`, converts markdown report to HTML, sends via Resend
- Project ref: `ehyjjvhfmbemtkogblne`

### Styling Conventions
- Dark theme using custom Tailwind colors: `brand-dark`, `brand-primary`, `brand-calm`, `brand-sky`, `brand-gray` (defined in `index.html` or Tailwind config)
- Glassmorphism: `bg-white/5 backdrop-blur-xl border border-white/10` pattern used throughout
- Animations via Framer Motion (`motion.div` with `initial`/`animate`/`transition` props)
- `index.css` provides global styles, custom scrollbars, and `.glass`/`.glass-dark` utility classes
