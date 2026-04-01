import React, { useState } from 'react';
import { QUESTIONS, CAL_COM_LINK } from './constants';
import { UserResponse, LeadData, AuditResult } from './types';
import LandingPage from './components/LandingPage';
import AuditForm from './components/AuditForm';
import BookingScreen from './components/BookingScreen';
import ProcessingView from './components/ProcessingView';
import { submitToDatabase } from './services/storageService';
import { submitLeadDataToWebhook, submitLeadInfoToWebhook } from './services/webhookService';

type AppState = 'landing' | 'form' | 'processing' | 'booking';

import { DEMO_LEAD_DATA } from './demoData';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('landing');
  const [leadInfo, setLeadInfo] = useState({ name: '', email: '', businessName: '' });
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [finalLeadData, setFinalLeadData] = useState<LeadData | null>(null);

  const calculateResult = (userResponses: UserResponse[]): AuditResult => {
    // Calculate score for 'scored' and 'select' type questions (14 questions, max 70 points)
    const scoredResponses = userResponses.filter(r => {
      const q = QUESTIONS.find(question => question.id === r.questionId);
      return q?.type === 'scored' || q?.type === 'select';
    });

    const totalScore = scoredResponses.reduce((sum, r) => sum + (r.selectedOption?.score || 0), 0);
    const maxPossible = scoredResponses.length * 5;
    const readinessPercentage = Math.round((totalScore / maxPossible) * 100);

    const pillarScores: Record<string, number> = {};
    scoredResponses.forEach(r => {
      const q = QUESTIONS.find(question => question.id === r.questionId);
      if (q) {
        pillarScores[q.pillar] = (pillarScores[q.pillar] || 0) + (r.selectedOption?.score || 0);
      }
    });

    let level: 'Low' | 'Medium' | 'High' = 'Low';
    if (readinessPercentage >= 70) level = 'High';
    else if (readinessPercentage >= 40) level = 'Medium';

    const recommendation = level === 'High'
      ? "Strong revenue foundation. You're ready for a full AI Revenue System."
      : level === 'Medium'
        ? "Revenue gaps identified. Start with automated lead response and follow-up sequences."
        : "High revenue potential at risk. Prioritise immediate lead handling and response automation.";

    return {
      totalScore,
      readinessPercentage,
      level,
      recommendation,
      pillarScores
    };
  };

  const handleStartAudit = (info: { name: string; email: string; businessName: string }) => {
    setLeadInfo(info);
    setState('form');
    void submitLeadInfoToWebhook(info);
  };

  const handleFormComplete = async (finalResponses: UserResponse[]) => {
    setState('processing');
    const result = calculateResult(finalResponses);
    setAuditResult(result);

    // Prepare lead data
    const completeLeadData: LeadData = {
      name: leadInfo.name,
      email: leadInfo.email,
      businessName: leadInfo.businessName,
      responses: finalResponses,
      auditResult: result
    };

    setFinalLeadData(completeLeadData);

    void submitLeadDataToWebhook(completeLeadData);

    // 1. Submit to Supabase (fire and forget / robust handling inside service)
    await submitToDatabase(completeLeadData);

    // 2. Transition to Booking Screen instead of Redirecting
    setState('booking');
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark selection:bg-brand-primary selection:text-white font-sans text-white">
      <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-brand-dark/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setState('landing')}>
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-calm rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20 transition-transform group-hover:scale-105 border border-white/10">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold font-heading text-white tracking-tight">Heartbeat <span className="text-brand-primary">Audit</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span className="text-sm text-brand-sky font-medium tracking-wide border border-white/10 px-3 py-1 rounded-full bg-white/5">v2.0 Beta</span>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-20">
        {state === 'landing' && <LandingPage onStart={handleStartAudit} />}
        {state === 'form' && (
          <AuditForm
            userName={leadInfo.name}
            onComplete={handleFormComplete}
          />
        )}
        {state === 'processing' && <ProcessingView />}
        {state === 'booking' && finalLeadData && (
          <BookingScreen leadData={finalLeadData} />
        )}
      </main>

      <footer className="bg-brand-dark py-12 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-brand-gray text-sm">© 2026 AI Readiness Protocol. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
