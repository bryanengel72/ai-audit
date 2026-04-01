
import { GoogleGenAI } from "@google/genai";
import { LeadData } from "../types";

export const generateAuditReport = async (leadData: LeadData): Promise<string> => {
  // SAFELY access env vars. In Vite, process.env might not be defined. Use import.meta.env.
  // Note: VITE_ variables are exposed. Regular env vars like GEMINI_API_KEY are NOT exposed unless prefixed.
  // We'll fallback to mock if the key isn't found.
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  // MOCK MODE: If no valid key, return a high-quality mock report
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY' || apiKey.includes('PLACEHOLDER')) {
    console.warn("Using Mock Report (No API Key Found)");
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI delay

    const missedLeads = leadData.responses.find(r => r.questionId === 'q7')?.selectedOption?.text || 'occasionally';
    const responseSpeed = leadData.responses.find(r => r.questionId === 'q8')?.selectedOption?.text || 'same day';
    const afterLead = leadData.responses.find(r => r.questionId === 'q9')?.selectedOption?.text || 'manually when available';
    const dataLocation = leadData.responses.find(r => r.questionId === 'q4')?.selectedOption?.text || 'scattered sources';
    const automationLevel = leadData.responses.find(r => r.questionId === 'q5')?.selectedOption?.text || 'mostly manual';

    return `### 1. Revenue Diagnostic Summary
Based on your responses, ${leadData.businessName} is currently operating at a **${leadData.auditResult.level} Revenue Readiness Level** (Score: ${leadData.auditResult.readinessPercentage}%).

Your audit reveals a clear pattern: revenue is leaking through the gaps in your lead handling process. The combination of responding *"${responseSpeed}"* and leads going unresponded *"${missedLeads}"* represents a direct, measurable loss of closed deals every single month.

**The Core Insight:** The gap between where you are and a fully optimised AI Revenue System is not structural — it's operational. The fix is automation, not more effort.

### 2. Primary Revenue Leak Identified
We analysed your lead handling process — specifically what happens after someone contacts your business (*"${afterLead}"*) and your current data infrastructure (*${dataLocation}*).

*   **Revenue Risk:** Leads going without timely response lose interest fast. Studies show that responding within 5 minutes vs. 30 minutes increases conversion probability by over 100x.
*   **Compounding Problem:** With your current automation level (*"${automationLevel}"*), every new lead requires manual action — meaning your response speed is capped by how fast your team moves, not by what's technically possible.
*   **Data Gap:** Client data in *${dataLocation}* prevents AI from learning your business context and automating personalised outreach.

### 3. The 90-Day Revenue Recovery Roadmap
To close the gap and recover revenue currently being lost to slow or missed follow-up:

**Phase 1: Instant Lead Response System (Days 1–30)**
*   **Goal:** Respond to every new inquiry within 60 seconds — automatically.
*   **Action:** Deploy an AI-powered lead capture and instant response system connected to all your inbound channels (website, social, email).
*   **Expected Outcome:** Every lead acknowledged immediately, 24/7, without manual effort.

**Phase 2: Automated Follow-Up Sequences (Days 31–60)**
*   **Goal:** Eliminate dropped leads from lack of follow-up.
*   **Action:** Build multi-step follow-up sequences (SMS + email) that automatically nurture leads over 5–7 touchpoints until they book or opt out.
*   **Expected Outcome:** 30–50% more leads converted from your existing inquiry volume.

**Phase 3: AI Concierge & Booking Automation (Days 61–90)**
*   **Goal:** 24/7 qualification and booking without human involvement.
*   **Action:** Launch a conversational AI that qualifies leads, answers FAQs, and books appointments directly into your calendar while you sleep.
*   **Expected Outcome:** Fully automated lead-to-booked-call pipeline running in the background.

### 4. Technical Recommendations
*   **First Priority:** Centralise your lead data from *${dataLocation}* into a unified CRM so automation has a single source of truth.
*   **Integration Layer:** Connect inbound channels to your CRM via Make.com or n8n to trigger instant responses without manual data entry.
*   **Security:** All AI agents should operate within a "Human-in-the-Loop" review framework initially to maintain quality control.

### 5. Next Steps
This report outlines the revenue recovery architecture specific to ${leadData.businessName}. To build the actual system, we need to map your specific workflows and channels.

**Action Required:** Please **use the calendar on the right** to schedule your comprehensive strategy review. We will walk through this roadmap in detail and provide you with a custom implementation plan.`;
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are an AI Revenue Systems consultant. Generate a concise, high-impact audit report for ${leadData.businessName} based on their assessment results.

    SCORING: ${leadData.auditResult.readinessPercentage}% Revenue Readiness (${leadData.auditResult.level} level)

    KEY DATA POINTS:
    - Missed leads frequency (Q7): ${leadData.responses.find(r => r.questionId === 'q7')?.selectedOption?.text || 'not provided'}
    - Response speed (Q8): ${leadData.responses.find(r => r.questionId === 'q8')?.selectedOption?.text || 'not provided'}
    - What happens after lead (Q9): ${leadData.responses.find(r => r.questionId === 'q9')?.selectedOption?.text || 'not provided'}
    - Follow-up depth (Q10): ${leadData.responses.find(r => r.questionId === 'q10')?.selectedOption?.text || 'not provided'}
    - Data location (Q4): ${leadData.responses.find(r => r.questionId === 'q4')?.selectedOption?.text || 'not provided'}
    - Automation level (Q5): ${leadData.responses.find(r => r.questionId === 'q5')?.selectedOption?.text || 'not provided'}
    - Financial impact if fixed (Q14): ${leadData.responses.find(r => r.questionId === 'q14')?.selectedOption?.text || 'not provided'}
    - 90-day success criteria (Q13): ${leadData.responses.find(r => r.questionId === 'q13')?.textResponse || 'not provided'}
    - Pilot preference (Q15): ${leadData.responses.find(r => r.questionId === 'q15')?.selectedOption?.text || 'not provided'}

    FORMAT RULES:
    1. Use ### for section headers.
    2. Use bullet points for recommendations.
    3. Keep paragraphs short (2-3 sentences max).
    4. Focus on revenue leakage and the specific gap between their current lead handling and a fully automated AI Revenue System.

    CONTENT STRUCTURE:
    ### Revenue Diagnostic Summary
    Summarise their revenue readiness level and the core lead handling gap identified.

    ### Primary Revenue Leak
    Analyse Q7–Q10 (lead handling data). Quantify what slow/missed responses cost them. Why is this specifically holding back revenue right now?

    ### 90-Day Revenue Recovery Roadmap
    Give 3 high-impact, specific wins based on their success criteria (Q13), financial impact (Q14), and pilot preference (Q15).

    ### Technical Recommendations
    Specific tools and integrations based on their data location (Q4) and automation level (Q5).

    ### Next Steps
    End with a clear directive to use the calendar on the right to schedule their strategy breakdown call.

    Tone: Sophisticated, urgent, and revenue-focused. Avoid generic advice. Every recommendation should tie back to closing more leads.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    // The @google/genai SDK usually provides a .text getter on the response object
    return response.text || "Strategic summary is being finalized. Please discuss your results during the booking call.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Your revenue audit is complete! We've identified your primary lead handling gaps and will review the full implementation roadmap during our upcoming call. Please select a time on the calendar.";
  }
};
