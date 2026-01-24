import { LeadData, Pillar } from './types';

export const DEMO_LEAD_DATA: LeadData = {
    name: "Alex Sterling",
    email: "alex@acmecorp.com",
    businessName: "Acme Corp",
    responses: [
        { questionId: 'q1', textResponse: "We are overwhelmed by manual data entry and want to scale faster." },
        { questionId: 'q2', textResponse: "Marketing agency for real estate agents." },
        { questionId: 'q3', selectedOptions: [{ text: "Save time / reduce admin load", score: 0 }, { text: "More qualified leads", score: 0 }] },
        { questionId: 'q4', textResponse: "Copying leads from Facebook Ads to our CRM manually." },
        { questionId: 'q5', textResponse: "Weekly reporting is a nightmare." },
        { questionId: 'q6', selectedOption: { text: "Basic repeatable process, but manual", score: 3 } },
        { questionId: 'q7', selectedOptions: [{ text: "CRM", score: 0 }, { text: "Google Sheets", score: 0 }] },
        { questionId: 'q8', selectedOption: { text: "Spreadsheets (Google Sheets/Excel)", score: 2 } },
        { questionId: 'q9', selectedOption: { text: "None, everything is 100% manual", score: 1 } },
        { questionId: 'q10', selectedOption: { text: "Some core processes are written down", score: 3 } },
        { questionId: 'q11', selectedOption: { text: "Team, mixed comfort", score: 3 } },
        { questionId: 'q12', selectedOption: { text: "Use it occasionally for drafting or ideas", score: 3 } },
        { questionId: 'q13', selectedOption: { text: "No restrictions, we can use any tools", score: 5 } },
        { questionId: 'q14', textResponse: "Automate lead entry and save 10 hours a week." },
        { questionId: 'q15', selectedOption: { text: "One high-impact workflow pilot first", score: 4 } }
    ],
    auditResult: {
        totalScore: 24,
        readinessPercentage: 47, // (24/50) roughly
        level: 'Medium',
        recommendation: "Systems present but leaky. Start with 2 core automated workflows.",
        pillarScores: {
            [Pillar.PROCESSES]: 6, // q6(3) + q10(3)
            [Pillar.TOOLS]: 6,     // q9(1) + q13(5)
            [Pillar.PEOPLE]: 6,    // q12(3) + q11(3 is select but mapped?)
            [Pillar.STRATEGY]: 4,  // q15(4)
            [Pillar.DATA]: 2       // q8(2)
        }
    }
};
