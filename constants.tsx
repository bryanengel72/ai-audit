
import { Pillar, Question } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    pillar: Pillar.STRATEGY,
    type: 'text',
    question: "What made you interested in exploring AI or automation for your business right now?",
    placeholder: "e.g., Scaling issues, manual work overload, staying competitive..."
  },
  {
    id: 'q2',
    pillar: Pillar.STRATEGY,
    type: 'text',
    question: "Give us the quick version of your business—who you serve and what you offer.",
    placeholder: "e.g., We are a marketing agency serving HVAC companies..."
  },
  {
    id: 'q3',
    pillar: Pillar.STRATEGY,
    type: 'text',
    question: "What are your top 2–3 business goals for the next 12 months?",
    placeholder: "e.g., Double revenue, hire 3 new staff, automate onboarding..."
  },
  {
    id: 'q4',
    pillar: Pillar.PROCESSES,
    type: 'text',
    question: "Where do you feel the most friction or bottlenecks in your day-to-day operations?",
    placeholder: "e.g., Chasing leads for payments, manual data entry between systems..."
  },
  {
    id: 'q5',
    pillar: Pillar.PROCESSES,
    type: 'text',
    question: "If we could remove one recurring task or headache from your week, what would it be?",
    placeholder: "e.g., Updating the CRM after every sales call..."
  },
  {
    id: 'q6',
    pillar: Pillar.PROCESSES,
    type: 'scored',
    question: "How do new leads usually find you, and what happens after they reach out?",
    options: [
      { text: "No clear process, we just respond when we can", score: 1 },
      { text: "Loose manual steps, often forget to follow up", score: 2 },
      { text: "Basic repeatable process, but manual", score: 3 },
      { text: "Mostly defined pipeline, fairly consistent", score: 4 },
      { text: "Automated funnel with instant follow-ups", score: 5 }
    ]
  },
  {
    id: 'q7',
    pillar: Pillar.TOOLS,
    type: 'scored',
    question: "What's the status of your current tech stack (CRM, Booking, Email, PM)?",
    options: [
      { text: "Disconnected tools or no core systems", score: 1 },
      { text: "A few tools but they don't talk to each other", score: 2 },
      { text: "Core tools in place but data is messy", score: 3 },
      { text: "Tools are mostly integrated and working well", score: 4 },
      { text: "Fully integrated, streamlined 'Source of Truth'", score: 5 }
    ]
  },
  {
    id: 'q8',
    pillar: Pillar.DATA,
    type: 'scored',
    question: "Where does your customer/client data mainly live right now?",
    options: [
      { text: "Inbox, DMs, or physical paper", score: 1 },
      { text: "Multiple random spreadsheets", score: 2 },
      { text: "Scattered across several software tools", score: 3 },
      { text: "Mainly centralized in one CRM", score: 4 },
      { text: "Clean, centralized, and synced CRM", score: 5 }
    ]
  },
  {
    id: 'q9',
    pillar: Pillar.TOOLS,
    type: 'scored',
    question: "Do you have any automations already in place (Reminders, Follow-ups, etc.)?",
    options: [
      { text: "None, everything is 100% manual", score: 1 },
      { text: "Simple built-in app notifications only", score: 2 },
      { text: "A few Zapier/Make connections for small tasks", score: 3 },
      { text: "Several key workflows are automated", score: 4 },
      { text: "Automation is core to our operations", score: 5 }
    ]
  },
  {
    id: 'q10',
    pillar: Pillar.PROCESSES,
    type: 'scored',
    question: "Are your key processes documented (SOPs, checklists, or docs)?",
    options: [
      { text: "No documentation at all", score: 1 },
      { text: "A few rough notes that are rarely used", score: 2 },
      { text: "Some core processes are written down", score: 3 },
      { text: "Most recurring tasks have clear SOPs", score: 4 },
      { text: "Full library of up-to-date, used SOPs", score: 5 }
    ]
  },
  {
    id: 'q11',
    pillar: Pillar.PEOPLE,
    type: 'scored',
    question: "How comfortable is your team with adopting new tools?",
    options: [
      { text: "High resistance to any technology change", score: 1 },
      { text: "Skeptical, takes a long time to adapt", score: 2 },
      { text: "Mixed, depends on the tool", score: 3 },
      { text: "Generally open and willing to learn", score: 4 },
      { text: "Tech-forward, actively seeking new tools", score: 5 }
    ]
  },
  {
    id: 'q12',
    pillar: Pillar.PEOPLE,
    type: 'scored',
    question: "Have you or your team used AI tools before (ChatGPT, bots, etc)?",
    options: [
      { text: "Never used AI", score: 1 },
      { text: "Tried ChatGPT once or twice, didn't stick", score: 2 },
      { text: "Use it occasionally for drafting or ideas", score: 3 },
      { text: "Use it weekly for specific workflows", score: 4 },
      { text: "AI is integrated into our daily tools", score: 5 }
    ]
  },
  {
    id: 'q13',
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
    id: 'q14',
    pillar: Pillar.STRATEGY,
    type: 'text',
    question: "In the next 90 days, what would need to happen for you to say this project was a 'win'?",
    placeholder: "e.g., Save 10 hours a week, 20% more lead conversions..."
  },
  {
    id: 'q15',
    pillar: Pillar.STRATEGY,
    type: 'text',
    question: "Do you prefer starting with one high-impact pilot, or a broader systems upgrade?",
    placeholder: "e.g., Let's fix the lead follow-up first vs. Revamp everything..."
  }
];

export const CAL_COM_LINK = "https://cal.com/hbosb/ai-readiness-assessment-complimentary";
