import { LeadData } from '../types';

type LeadInfo = {
  name: string;
  email: string;
  businessName: string;
};

const DEFAULT_WEBHOOK_URL =
  'https://n8n.srv1035849.hstgr.cloud/webhook/ec614bd1-1e17-49c2-927f-9b93086fc8d8';

const getWebhookUrl = (): string => {
  const envUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  if (typeof envUrl === 'string' && envUrl.trim()) return envUrl;
  return DEFAULT_WEBHOOK_URL;
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
    leadData,
  });
};
