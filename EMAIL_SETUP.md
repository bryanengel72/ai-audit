# Email Report Setup Guide

This guide will help you deploy the email report functionality using Supabase Edge Functions and Resend.

## Prerequisites

1. **Supabase CLI** installed
2. **Resend Account** (free tier: 3,000 emails/month)

## Step 1: Get Resend API Key

1. Go to [resend.com](https://resend.com) and sign up
2. Navigate to **API Keys** in the dashboard
3. Click **Create API Key**
4. Copy the key (starts with `re_`)

## Step 2: Deploy the Edge Function

```bash
# Login to Supabase (if not already logged in)
npx supabase login

# Link your project
npx supabase link --project-ref ehyjjvhfmbemtkogblne

# Set the Resend API key as a secret
npx supabase secrets set RESEND_API_KEY=re_your_api_key_here

# Deploy the function
npx supabase functions deploy send-report
```

## Step 3: Update Email Sender (Optional)

By default, the function uses Resend's sandbox domain (`onboarding@resend.dev`), which only delivers to your verified email.

**For Production:**
1. Verify your domain in Resend
2. Update line 66 in `supabase/functions/send-report/index.ts`:
   ```typescript
   from: 'AI Readiness Audit <noreply@yourdomain.com>',
   ```
3. Redeploy: `npx supabase functions deploy send-report`

## Step 4: Test the Function

1. Reload your app at `http://localhost:3000`
2. Complete the audit (or use demo mode)
3. Click **"Email Report"** button
4. Check your inbox!

## Troubleshooting

### Email not received?
- Check spam folder
- Verify the email address in demo data matches your Resend verified email
- Check Supabase function logs: `npx supabase functions logs send-report`

### Function deployment fails?
- Ensure you're linked to the correct project
- Verify the API key is set: `npx supabase secrets list`

### CORS errors?
- The function includes CORS headers for all origins (`*`)
- For production, update line 5 to restrict to your domain
