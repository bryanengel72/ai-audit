
export enum Pillar {
  STRATEGY = 'Strategy & Context',
  DATA = 'Data & Systems',
  PROCESSES = 'Processes & Operations',
  PEOPLE = 'People & Culture',
  TOOLS = 'Tools & Security',
  LEAD_HANDLING = 'Lead Revenue & Handling'
}

export type QuestionType = 'scored' | 'text' | 'multiselect' | 'select';

export interface QuestionOption {
  text: string;
  score: number;
}

export interface Question {
  id: string;
  pillar: Pillar;
  type: QuestionType;
  question: string;
  options?: QuestionOption[];
  placeholder?: string;
  maxSelect?: number;
}

export interface UserResponse {
  questionId: string;
  selectedOption?: QuestionOption;
  selectedOptions?: QuestionOption[];
  textResponse?: string;
}

export interface AuditResult {
  totalScore: number;
  readinessPercentage: number;
  pillarScores: Record<string, number>;
  level: 'Low' | 'Medium' | 'High';
  recommendation: string;
}

export interface LeadData {
  name: string;
  email: string;
  businessName: string;
  responses: UserResponse[];
  auditResult: AuditResult;
}
