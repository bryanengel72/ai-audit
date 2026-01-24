
import React, { useState } from 'react';
import { QUESTIONS } from './constants';
import { UserResponse, LeadData, AuditResult } from './types';
import LandingPage from './components/LandingPage';
import AuditForm from './components/AuditForm';
import ResultsDashboard from './components/ResultsDashboard';

type AppState = 'landing' | 'form' | 'results';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('landing');
  const [leadInfo, setLeadInfo] = useState({ name: '', email: '', businessName: '' });
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);

  const calculateResult = (userResponses: UserResponse[]): AuditResult => {
    // Only calculate score for 'scored' type questions
    const scoredResponses = userResponses.filter(r => {
      const q = QUESTIONS.find(question => question.id === r.questionId);
      return q?.type === 'scored';
    });

    const totalScore = scoredResponses.reduce((sum, r) => sum + (r.selectedOption?.score || 0), 0);
    // Max score is 5 per scored question. We have 8 scored questions (Q6-Q13) = 40 max
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
      ? "Strong foundation. You're ready for end-to-end Autonomous Ops."
      : level === 'Medium'
        ? "Systems present but leaky. Start with 2 core automated workflows."
        : "Initial phase. Focus on clean data and documented SOPs first.";

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
  };

  const handleFormComplete = (finalResponses: UserResponse[]) => {
    const result = calculateResult(finalResponses);
    setResponses(finalResponses);
    setAuditResult(result);
    setState('results');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 selection:bg-blue-500 selection:text-white font-sans text-white">
      <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setState('landing')}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105 border border-white/10">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">2026 AI <span className="text-blue-400">Audit</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span className="text-sm text-blue-200/60 font-medium tracking-wide border border-white/10 px-3 py-1 rounded-full bg-white/5">v2.0 Beta</span>
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
        {state === 'results' && auditResult && (
          <ResultsDashboard
            leadData={{
              name: leadInfo.name,
              email: leadInfo.email,
              businessName: leadInfo.businessName,
              responses,
              auditResult
            }}
          />
        )}
      </main>

      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">© 2026 AI Readiness Audit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
