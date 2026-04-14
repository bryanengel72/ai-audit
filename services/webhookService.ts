import { LeadData, UserResponse } from '../types';
import { QUESTIONS } from '../constants';

type LeadInfo = {
  name: string;
  email: string;
  phone: string;
};

const DEFAULT_WEBHOOK_URL =
  'https://n8n.srv1035849.hstgr.cloud/webhook/7aec9fc3-a20d-446d-91b4-531f1687495e';

const getWebhookUrl = (): string => {
  const envUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  if (typeof envUrl === 'string' && envUrl.trim()) return envUrl;
  return DEFAULT_WEBHOOK_URL;
};

const enrichResponses = (responses: UserResponse[]) => {
  return responses.map(r => {
    const question = QUESTIONS.find(q => q.id === r.questionId);
    let answer: string | null = null;
    let score: number | null = null;

    if (r.textResponse !== undefined) {
      answer = r.textResponse;
    } else if (r.selectedOptions !== undefined) {
      answer = r.selectedOptions.map(o => o.text).join(', ');
    } else if (r.selectedOption !== undefined) {
      answer = r.selectedOption.text;
      score = r.selectedOption.score;
    }

    return {
      questionId: r.questionId,
      question: question?.question ?? r.questionId,
      pillar: question?.pillar ?? null,
      answer,
      score,
    };
  });
};

export const submitToWebhook = async (payload: unknown): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(getWebhookUrl(), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error('Error submitting to webhook:', res.status, await res.text());
      return false;
    }

    return true;
  } catch (err) {
    console.error('Unexpected error submitting to webhook:', err);
    return false;
  }
};

export const submitLeadInfoToWebhook = async (leadInfo: LeadInfo): Promise<boolean> => {
  return submitToWebhook({
    event: 'lead_start',
    timestamp: new Date().toISOString(),
    leadInfo,
  });
};

export const submitLeadDataToWebhook = async (leadData: LeadData): Promise<boolean> => {
  return submitToWebhook({
    event: 'audit_complete',
    timestamp: new Date().toISOString(),
    // Top-level fields for easy n8n mapping
    name: leadData.name,
    email: leadData.email,
    phone: leadData.phone,
    businessName: leadData.businessName,
    score: leadData.auditResult.readinessPercentage,
    level: leadData.auditResult.level,
    recommendation: leadData.auditResult.recommendation,
    pillarScores: leadData.auditResult.pillarScores,
    // All 15 responses enriched with question text and pillar
    responses: enrichResponses(leadData.responses),
    // Full nested object preserved for completeness
    leadData,
  });
};
