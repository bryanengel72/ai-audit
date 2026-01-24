
import { GoogleGenAI } from "@google/genai";
import { LeadData } from "../types";

export const generateAuditReport = async (leadData: LeadData): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
    
    Tone: Sophisticated, insightful, and urgent. Avoid generic advice.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text || "Strategic summary is being finalized. Please discuss your results during the booking call.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Your technical audit is complete! We've identified your primary bottlenecks and will review the qualitative strategic map during our upcoming call.";
  }
};
