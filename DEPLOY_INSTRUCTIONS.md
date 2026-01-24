# Manual Deployment Instructions

Since we need interactive terminal access, please follow these steps to deploy the email function:

## Step 1: Complete Supabase Login

The login process has already started. In your terminal, you should see a prompt asking for a verification code.

1. Open the browser link that was shown (or it may have opened automatically)
2. Complete the Supabase login
3. Copy the verification code from the browser
4. Paste it into the terminal where it says "Enter your verification code:"

## Step 2: Link Project

After login completes, run:
```bash
npx supabase link --project-ref ehyjjvhfmbemtkogblne
```

## Step 3: Set Resend API Key

```bash
npx supabase secrets set RESEND_API_KEY=re_aF32Nyas_AFmp5YWUpqSK7TpzVcedNHEs
```

## Step 4: Deploy Function

```bash
npx supabase functions deploy send-report
```

## Step 5: Test

Reload your app and click the "Email Report" button!

---

**Note**: Your Resend API key is saved in this file. After deployment, you may want to delete this file or regenerate the key for security.
