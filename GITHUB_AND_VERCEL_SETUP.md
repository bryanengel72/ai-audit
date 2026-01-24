# Deployment Guide: GitHub & Vercel

Since the CLI tools need your login permissions, please follow these steps to deploy your live app.

## Part 1: Push to GitHub

1.  **Create a new repository** on [GitHub](https://github.com/new) named \`ai-readiness-audit\`.
2.  Run these commands in your terminal to push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-readiness-audit.git
git branch -M main
git push -u origin main
```
*(Replace `YOUR_USERNAME` with your actual GitHub username)*

## Part 2: Deploy to Vercel

1.  Go to [Vercel Dashboard](https://vercel.com/new).
2.  Import your `ai-readiness-audit` repository.
3.  **IMPORTANT:** Expanding the **"Environment Variables"** section and add these:

| Name | Value |
|------|-------|
| `VITE_GEMINI_API_KEY` | *(Your Gemini API Key)* |
| `VITE_SUPABASE_URL` | `https://ehyjjvhfmbemtkogblne.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoeWpqdmhmbWJlbXRrb2dibG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyODI1NTMsImV4cCI6MjA4NDg1ODU1M30.dUxknbHJm0NIWIX4GppP5xfhA6GwFDQVVO8yDMZN5nk` |
| `VITE_RESEND_API_KEY` | `re_aF32Nyas_AFmp5YWUpqSK7TpzVcedNHEs` |

4.  Click **Deploy**.

## Part 3: Go Live!

Once Vercel finishes:
1.  Open your new `.vercel.app` URL.
2.  Test the audit again to make sure emails and reports are firing correctly!
