
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
    return `### 1. Executive Strategy Summary
Based on your responses, ${leadData.businessName} is currently operating at a **${leadData.auditResult.level} Readiness Level** (Score: ${leadData.auditResult.readinessPercentage}%).
    
Your primary goal to *${leadData.responses.find(r => r.questionId === 'q3')?.selectedOptions?.map(o => o.text).join(', ') || 'scale operations'}* is achievable, but your current infrastructure suggests significant "operational drag" caused by manual workflows.

**The Good News:** You have the foundational elements in place. The gap between where you are and "Autonomous Operations" is primarily technological, not structural.

### 2. Primary Bottleneck Identification
We analyzed your operational friction points ("${leadData.responses.find(r => r.questionId === 'q5')?.textResponse || 'Manual Data Entry'}") and data fragmentation.

*   **Risk Area:** Client data residing in ${leadData.responses.find(r => r.questionId === 'q8')?.selectedOption?.text || 'scattered sources'}. This creates "Data Silos" that prevent AI from learning your business context.
*   **Opportunity Cost:** Every hour spent on ${leadData.responses.find(r => r.questionId === 'q4')?.textResponse ? '"' + leadData.responses.find(r => r.questionId === 'q4')?.textResponse + '"' : 'repetitive admin'} is an hour stolen from high-leverage strategy or sales.

### 3. The 90-Day Implementation Roadmap
To bridge this gap and achieve your 2026 readiness targets, we recommend a phased deployment:

**Phase 1: The "Digital Nervous System" (Days 1-30)**
*   **Goal:** Centralize data and eliminate data entry.
*   **Action:** Implement a unified Customer Data Platform (CDP) that automatically captures lead interactions from all channels.
*   **Expected Outcome:** 100% visibility into pipeline health without manual reporting.

**Phase 2: The "Kill-Switch" Protocol (Days 31-60)**
*   **Goal:** Automate your most hated task.
*   **Action:** Deploy a custom AI Agent specifically designed to handle "${leadData.responses.find(r => r.questionId === 'q5')?.textResponse || 'Workflow Admin'}" from start to finish.
*   **Expected Outcome:** 10-15 hours reclaimed per week immediately.

**Phase 3: AI Concierge Alpha (Days 61-90)**
*   **Goal:** 24/7 Responsiveness.
*   **Action:** Launch a client-facing AI interface that can answer FAQs, schedule appointments, and qualify leads while you sleep.

### 4. Technical Recommendations
*   **Integration:** Connect your current tools (${leadData.responses.find(r => r.questionId === 'q7')?.selectedOptions?.map(o => o.text).join(', ') || 'stack'}) via a middleware like Make.com or n8n.
*   **Security:** Ensure all AI agents operate within a "Human-in-the-Loop" framework initially to maintain quality control.

### 5. Next Steps
This report provides the high-level architecture. To execute this, we need to map your specific workflows.

**Action Required:** Please **use the calendar on the right** to schedule your comprehensive strategy review. We will walk through this roadmap in detail and provide you with a custom implementation quote.`;
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are an expert AI Automation Strategist. I have a potential client who just completed a deep 15-question discovery audit for their 2026 AI Readiness.
    
    Client Context:
    - Name: ${leadData.name}
    - Business: ${leadData.businessName}
    
    Discovery Insight (Qualitative):
    ${leadData.responses.map(r => {
    if (r.textResponse) return `- QID ${r.questionId}: ${r.textResponse}`;
    return "";
  }).filter(Boolean).join('\n')}
    
    Technical Readiness Summary (Quantitative):
    - Overall Score: ${leadData.auditResult.readinessPercentage}%
    - Category Scores: ${Object.entries(leadData.auditResult.pillarScores).map(([p, s]) => `${p}: ${s}/5`).join(', ')}
    
    Objective: Create a highly personalized, executive-level analysis.
    
    CRITICAL FORMATTING RULES:
    1. Use ONLY ### for headers. No # or ##.
    2. Use bullet points for recommendations.
    3. Keep paragraphs short (2-3 sentences max).
    4. Focus on the "Gap" between where they are now and "Autonomous Operations".
    
    CONTENT STRUCTURE:
    ### Strategic Context
    Summarize their goals (Q3) and current AI interest (Q1).
    
    ### The Primary Bottleneck
    Analyze the friction points from Q4-Q5. Why is this specifically holding them back from 2026 AI standards?
    
    ### 90-Day Priority Roadmap
    Give 3 high-impact, specific wins based on their "success criteria" (Q14) and "pilot preference" (Q15).

    ### Next Steps
    End with a clear directive to use the calendar on the right to schedule their strategy breakdown call.
    
    Tone: Sophisticated, insightful, and urgent. Avoid generic advice.
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
    return "Your technical audit is complete! We've identified your primary bottlenecks and will review the qualitative strategic map during our upcoming call. Please select a time on the calendar.";
  }
};
