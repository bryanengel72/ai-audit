
export enum Pillar {
  STRATEGY = 'Strategy & Context',
  DATA = 'Data & Systems',
  PROCESSES = 'Processes & Operations',
  PEOPLE = 'People & Culture',
  TOOLS = 'Tools & Security'
}

export type QuestionType = 'scored' | 'text';

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
}

export interface UserResponse {
  questionId: string;
  selectedOption?: QuestionOption;
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
