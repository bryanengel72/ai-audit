import { LeadData, Pillar } from './types';

export const DEMO_LEAD_DATA: LeadData = {
    name: "Alex Sterling",
    email: "alex@acmecorp.com",
    businessName: "Acme Corp",
    responses: [
        // q1 — Business description (text, no score)
        { questionId: 'q1', textResponse: "We run a marketing agency for real estate agents in the Southwest. We handle lead gen, email campaigns, and social media." },
        // q2 — Team structure (select, score: 5)
        { questionId: 'q2', selectedOption: { text: "Solo (just me)", score: 5 } },
        // q3 — Lead volume (select, score: 3)
        { questionId: 'q3', selectedOption: { text: "10–50 leads", score: 3 } },
        // q4 — Data location (select, score: 2)
        { questionId: 'q4', selectedOption: { text: "Spreadsheets (Google Sheets/Excel)", score: 2 } },
        // q5 — Automation level (scored, score: 1)
        { questionId: 'q5', selectedOption: { text: "None — everything is 100% manual", score: 1 } },
        // q6 — Process consistency (scored, score: 3)
        { questionId: 'q6', selectedOption: { text: "Some consistency, but it depends on who's handling it", score: 3 } },
        // q7 — Missed leads (scored, score: 2)
        { questionId: 'q7', selectedOption: { text: "Occasionally", score: 2 } },
        // q8 — Response speed (scored, score: 3)
        { questionId: 'q8', selectedOption: { text: "Same day", score: 3 } },
        // q9 — What happens after lead (scored, score: 1)
        { questionId: 'q9', selectedOption: { text: "We respond manually when available", score: 1 } },
        // q10 — Follow-up depth (scored, score: 2)
        { questionId: 'q10', selectedOption: { text: "1 time", score: 2 } },
        // q11 — AI comfort (scored, score: 3)
        { questionId: 'q11', selectedOption: { text: "Use occasionally for drafting or ideas", score: 3 } },
        // q12 — Constraints (scored, score: 5)
        { questionId: 'q12', selectedOption: { text: "No restrictions, we can use any tools", score: 5 } },
        // q13 — 90-day win (text, no score)
        { questionId: 'q13', textResponse: "Every lead responded to automatically within 5 minutes, and 20% more booked calls." },
        // q14 — Financial impact (select, score: 4)
        { questionId: 'q14', selectedOption: { text: "Significant growth", score: 4 } },
        // q15 — Pilot preference (scored, score: 4)
        { questionId: 'q15', selectedOption: { text: "Start with one high-impact system to generate results quickly", score: 4 } },
        // q16 — Final conversion (select, score: 5)
        { questionId: 'q16', selectedOption: { text: "Yes — show me my recommendations", score: 5 } }
    ],
    auditResult: {
        // Scored responses: q2(5)+q3(3)+q4(2)+q5(1)+q6(3)+q7(2)+q8(3)+q9(1)+q10(2)+q11(3)+q12(5)+q14(4)+q15(4)+q16(5) = 43
        // Max: 14 * 5 = 70
        // readinessPercentage: Math.round(43/70 * 100) = 61
        totalScore: 43,
        readinessPercentage: 61,
        level: 'Medium',
        recommendation: "Revenue gaps identified. Start with automated lead response and follow-up sequences.",
        pillarScores: {
            [Pillar.STRATEGY]: 13,       // q14(4) + q15(4) + q16(5)
            [Pillar.DATA]: 2,            // q4(2)
            [Pillar.PROCESSES]: 3,       // q6(3)
            [Pillar.PEOPLE]: 8,          // q2(5) + q11(3)
            [Pillar.TOOLS]: 6,           // q5(1) + q12(5)
            [Pillar.LEAD_HANDLING]: 11   // q3(3) + q7(2) + q8(3) + q9(1) + q10(2)
        }
    }
};
