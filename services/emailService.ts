import { supabase } from './supabaseClient';

export interface EmailReportParams {
    email: string;
    name: string;
    businessName: string;
    report: string;
    score: number;
    level: string;
}

export const sendReportEmail = async (params: EmailReportParams): Promise<{ success: boolean; error?: string }> => {
    try {
        const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;

        const { data, error } = await supabase.functions.invoke('send-report', {
            body: {
                ...params,
                resendApiKey, // Pass API key to function
            },
        });

        if (error) {
            console.error('Edge Function error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Unexpected error sending email:', err);
        return { success: false, error: 'Failed to send email' };
    }
};
