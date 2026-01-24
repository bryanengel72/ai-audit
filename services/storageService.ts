
import { LeadData } from "../types";
import { supabase } from "./supabaseClient";

export const submitToDatabase = async (leadData: LeadData, aiReport?: string): Promise<boolean> => {
  try {
    // Create a 5-second timeout promise
    const timeoutPromise = new Promise<{ error: any }>((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 5000);
    });

    // Race between Supabase insert and timeout
    const { error } = await Promise.race([
      supabase.from('audit_leads').insert([
        {
          name: leadData.name,
          email: leadData.email,
          business_name: leadData.businessName,
          responses: leadData.responses,
          audit_result: leadData.auditResult,
          ai_report: aiReport || null,
        },
      ]),
      timeoutPromise
    ]) as { error: any };

    if (error) {
      console.error('Error submitting to Supabase:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Unexpected error submitting to Supabase:', err);
    // Return true anyway so the user flow isn't blocked by analytics failure
    return true;
  }
};
