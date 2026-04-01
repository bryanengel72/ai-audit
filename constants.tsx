
import { Pillar, Question } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    pillar: Pillar.STRATEGY,
    type: 'text',
    question: "Give us the quick version of your business — who you serve and what you offer.",
    placeholder: "e.g., We run a marketing agency for HVAC companies in the Pacific Northwest..."
  },
  {
    id: 'q2',
    pillar: Pillar.PEOPLE,
    type: 'select',
    question: "Who's involved day-to-day, and how comfortable are they with new tools?",
    options: [
      { text: "Solo (just me)", score: 5 },
      { text: "Team, mostly comfortable with tools", score: 4 },
      { text: "Team, mixed comfort with tools", score: 3 },
      { text: "Team is mostly resistant to new tools", score: 2 }
    ]
  },
  {
    id: 'q3',
    pillar: Pillar.LEAD_HANDLING,
    type: 'select',
    question: "Approximately how many new inquiries or leads does your business receive each month?",
    options: [
      { text: "0–10 leads", score: 2 },
      { text: "10–50 leads", score: 3 },
      { text: "50–100 leads", score: 4 },
      { text: "100+ leads", score: 5 }
    ]
  },
  {
    id: 'q4',
    pillar: Pillar.DATA,
    type: 'select',
    question: "Where does your customer and lead data primarily live today?",
    options: [
      { text: "Inbox/DMs (email, Instagram, etc.)", score: 1 },
      { text: "Spreadsheets (Google Sheets/Excel)", score: 2 },
      { text: "Paper/notes", score: 1 },
      { text: "Multiple places — not centralized", score: 2 },
      { text: "Centralized CRM (HubSpot, Salesforce, etc.)", score: 5 }
    ]
  },
  {
    id: 'q5',
    pillar: Pillar.TOOLS,
    type: 'scored',
    question: "How automated is your current lead follow-up and customer communication?",
    options: [
      { text: "None — everything is 100% manual", score: 1 },
      { text: "Simple built-in app notifications only", score: 2 },
      { text: "A few Zapier/Make connections for small tasks", score: 3 },
      { text: "Several key workflows are automated", score: 4 },
      { text: "Automation is core to our operations", score: 5 }
    ]
  },
  {
    id: 'q6',
    pillar: Pillar.PROCESSES,
    type: 'scored',
    question: "How consistent is your team in following the same process for handling leads or customers?",
    options: [
      { text: "No consistent process — everyone handles it differently", score: 1 },
      { text: "We have rough steps but the team doesn't always follow them", score: 2 },
      { text: "Some consistency, but it depends on who's handling it", score: 3 },
      { text: "Mostly consistent — team generally follows the same process", score: 4 },
      { text: "Fully consistent — same process every time, for every lead", score: 5 }
    ]
  },
  {
    id: 'q7',
    pillar: Pillar.LEAD_HANDLING,
    type: 'scored',
    question: "How often do new inquiries go without a response or proper follow-up?",
    options: [
      { text: "Very often", score: 1 },
      { text: "Occasionally", score: 2 },
      { text: "Rarely", score: 4 },
      { text: "Never — all leads are responded to", score: 5 }
    ]
  },
  {
    id: 'q8',
    pillar: Pillar.LEAD_HANDLING,
    type: 'scored',
    question: "How quickly does your business typically respond to new leads?",
    options: [
      { text: "Next day or later", score: 1 },
      { text: "Same day", score: 3 },
      { text: "Within a few hours", score: 4 },
      { text: "Immediately (within minutes)", score: 5 }
    ]
  },
  {
    id: 'q9',
    pillar: Pillar.LEAD_HANDLING,
    type: 'scored',
    question: "What typically happens after someone contacts your business?",
    options: [
      { text: "We respond manually when available", score: 1 },
      { text: "We respond, but timing is inconsistent", score: 2 },
      { text: "We have a basic follow-up process in place", score: 3 },
      { text: "Leads are automatically responded to immediately", score: 5 }
    ]
  },
  {
    id: 'q10',
    pillar: Pillar.LEAD_HANDLING,
    type: 'scored',
    question: "How many times do you typically follow up with a lead before moving on?",
    options: [
      { text: "We don't have a structured follow-up process", score: 1 },
      { text: "1 time", score: 2 },
      { text: "2–3 times", score: 3 },
      { text: "4–5 times", score: 5 }
    ]
  },
  {
    id: 'q11',
    pillar: Pillar.PEOPLE,
    type: 'scored',
    question: "How comfortable are you or your team using AI tools in your daily workflow?",
    options: [
      { text: "Never used AI tools", score: 1 },
      { text: "Tried once or twice — didn't stick", score: 2 },
      { text: "Use occasionally for drafting or ideas", score: 3 },
      { text: "Use weekly for specific workflows", score: 4 },
      { text: "AI is integrated into our daily tools", score: 5 }
    ]
  },
  {
    id: 'q12',
    pillar: Pillar.TOOLS,
    type: 'scored',
    question: "Are there strict industry rules, privacy requirements, or tool restrictions?",
    options: [
      { text: "Extreme regulations (HIPAA/Fin) & strict IT", score: 1 },
      { text: "Some privacy rules but no clear guidance", score: 2 },
      { text: "Moderate rules, we have a general idea", score: 3 },
      { text: "Minimal constraints, mostly flexible", score: 4 },
      { text: "No restrictions, we can use any tools", score: 5 }
    ]
  },
  {
    id: 'q13',
    pillar: Pillar.STRATEGY,
    type: 'text',
    question: "In the next 90 days, what would need to happen for this to feel like a successful investment for your business?",
    placeholder: "e.g., Every lead responded to within 5 minutes, 20% more booked calls..."
  },
  {
    id: 'q14',
    pillar: Pillar.STRATEGY,
    type: 'select',
    question: "If every lead was responded to immediately and followed up consistently, what impact would that have on your business?",
    options: [
      { text: "Small improvement", score: 2 },
      { text: "Moderate improvement", score: 3 },
      { text: "Significant growth", score: 4 },
      { text: "Game-changing", score: 5 }
    ]
  },
  {
    id: 'q15',
    pillar: Pillar.STRATEGY,
    type: 'scored',
    question: "How would you prefer to get started?",
    options: [
      { text: "Start with one high-impact system to generate results quickly", score: 4 },
      { text: "Build a more complete system across multiple areas", score: 5 },
      { text: "Not sure — recommend what would have the biggest impact", score: 3 }
    ]
  },
  {
    id: 'q16',
    pillar: Pillar.STRATEGY,
    type: 'select',
    question: "Would you like a breakdown of what systems your business needs and how to implement them?",
    options: [
      { text: "Yes — show me my recommendations", score: 5 },
      { text: "Yes — I'd like to discuss this with your team", score: 4 },
      { text: "Not right now", score: 2 }
    ]
  }
];

export const CAL_COM_LINK = "https://cal.com/hbosb/heartbeat-audit";
