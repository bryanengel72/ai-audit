import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, name, businessName, report, score, level, resendApiKey } = await req.json()

    // Validate required fields
    if (!email || !name || !report) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use API key from request or environment
    const apiKey = resendApiKey || Deno.env.get('RESEND_API_KEY')
    if (!apiKey) {
      throw new Error('RESEND_API_KEY not configured')
    }

    const resend = new Resend(apiKey)

    // Convert markdown report to HTML
    const htmlReport = report
      .split('\n')
      .map(line => {
        const trimmed = line.trim()

        // Headers
        if (trimmed.startsWith('###')) {
          return `<h2 style="color: #3b82f6; font-size: 20px; font-weight: bold; margin-top: 32px; margin-bottom: 16px;">${trimmed.replace('###', '').trim()}</h2>`
        }

        // List items
        if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
          const content = trimmed.replace(/^[-*]\s*/, '')
          // Parse bold text
          const withBold = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          return `<li style="margin-bottom: 8px; color: #64748b;">${withBold}</li>`
        }

        // Empty lines
        if (trimmed === '') {
          return '<br/>'
        }

        // Paragraphs
        const withBold = trimmed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        return `<p style="color: #475569; line-height: 1.6; margin-bottom: 16px;">${withBold}</p>`
      })
      .join('\n')

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'AI Readiness Audit <onboarding@resend.dev>', // Change to your verified domain
      to: [email],
      subject: `Your 2026 AI Readiness Report - ${score}% (${level})`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 32px; margin-bottom: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); padding: 40px 32px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">2026 AI Readiness Audit</h1>
                <p style="color: #e0e7ff; margin-top: 8px; font-size: 14px;">Your Personalized Strategy Report</p>
              </div>

              <!-- Score Badge -->
              <div style="padding: 32px; text-align: center; background-color: #f8fafc;">
                <div style="display: inline-block; background-color: #ffffff; padding: 24px 48px; border-radius: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <div style="font-size: 48px; font-weight: bold; color: #1e293b; margin-bottom: 8px;">${score}%</div>
                  <div style="font-size: 14px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">${level} Readiness</div>
                </div>
              </div>

              <!-- Greeting -->
              <div style="padding: 0 32px 32px 32px;">
                <p style="font-size: 16px; color: #1e293b; margin-bottom: 16px;">Hi ${name},</p>
                <p style="font-size: 14px; color: #475569; line-height: 1.6;">
                  Thank you for completing the 2026 AI Readiness Audit for <strong>${businessName}</strong>. 
                  Below is your comprehensive analysis and strategic roadmap.
                </p>
              </div>

              <!-- Report Content -->
              <div style="padding: 0 32px 32px 32px; border-top: 1px solid #e2e8f0;">
                ${htmlReport}
              </div>

              <!-- CTA -->
              <div style="padding: 32px; background-color: #f8fafc; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="font-size: 14px; color: #64748b; margin-bottom: 16px;">Ready to implement your roadmap?</p>
                <a href="https://cal.com/hbosb/ai-readiness-assessment-complimentary" 
                   style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                  Schedule Your Strategy Session
                </a>
              </div>

              <!-- Footer -->
              <div style="padding: 24px 32px; background-color: #1e293b; text-align: center;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                  © 2026 AI Readiness Audit. All rights reserved.
                </p>
              </div>

            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, messageId: data?.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
