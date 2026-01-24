
import React, { useEffect, useState } from 'react';
import { LeadData } from '../types';
import { CAL_COM_LINK } from '../constants';
import { generateAuditReport } from '../services/geminiService';
import { submitToDatabase } from '../services/storageService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { jsPDF } from 'jspdf';

interface Props {
  leadData: LeadData;
}

const ResultsDashboard: React.FC<Props> = ({ leadData }) => {
  const [aiReport, setAiReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const processResults = async () => {
      setIsLoading(true);
      await submitToDatabase(leadData);
      setIsSaved(true);
      const report = await generateAuditReport(leadData);
      setAiReport(report);
      setIsLoading(false);
    };

    processResults();
  }, [leadData]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Indigo 600
    doc.text('2026 AI Readiness Audit', margin, y);
    y += 10;

    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text(`Client: ${leadData.name} | Business: ${leadData.businessName}`, margin, y);
    y += 15;

    // Score
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`Readiness Score: ${leadData.auditResult.readinessPercentage}%`, margin, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(`Level: ${leadData.auditResult.level} Readiness`, margin, y);
    y += 20;

    // Report Content
    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229);
    doc.text('Strategic Blueprint', margin, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    
    // Split text into lines that fit the page width
    const splitText = doc.splitTextToSize(aiReport, 170);
    
    // Handle multi-page content
    splitText.forEach((line: string) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += 6;
    });

    doc.save(`AI_Readiness_Audit_${leadData.businessName.replace(/\s+/g, '_')}.pdf`);
  };

  const chartData: { name: string; score: number }[] = Object.entries(leadData.auditResult.pillarScores).map(([name, score]) => ({
    name: name.split('&')[0].trim(),
    score: score as number
  }));

  const levelColor = leadData.auditResult.level === 'High' ? 'text-emerald-600' : leadData.auditResult.level === 'Medium' ? 'text-amber-600' : 'text-rose-600';
  const levelBg = leadData.auditResult.level === 'High' ? 'bg-emerald-50' : leadData.auditResult.level === 'Medium' ? 'bg-amber-50' : 'bg-rose-50';

  const formatReportText = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];

    lines.forEach((line, i) => {
      const trimmedLine = line.trim();
      
      // Handle Headers
      if (trimmedLine.startsWith('###')) {
        if (currentList.length > 0) {
          elements.push(<ul key={`list-${i}`} className="space-y-2 mb-6 list-none">{[...currentList]}</ul>);
          currentList = [];
        }
        elements.push(
          <h3 key={`h3-${i}`} className="text-xl font-bold text-indigo-900 mt-10 mb-4 flex items-center gap-3 first:mt-0">
            <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
            {trimmedLine.replace('###', '').trim()}
          </h3>
        );
      } 
      // Handle List Items
      else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        currentList.push(
          <li key={`li-${i}`} className="flex gap-3 text-gray-700 leading-relaxed">
            <span className="text-indigo-500 font-bold mt-1">•</span>
            <span>{trimmedLine.replace(/^[-*]\s*/, '').trim()}</span>
          </li>
        );
      } 
      // Handle Paragraphs/Empty space
      else {
        if (currentList.length > 0) {
          elements.push(<ul key={`list-${i}`} className="space-y-2 mb-6 list-none">{[...currentList]}</ul>);
          currentList = [];
        }
        if (trimmedLine === '') {
          elements.push(<div key={`space-${i}`} className="h-4" />);
        } else {
          elements.push(<p key={`p-${i}`} className="text-gray-700 leading-relaxed mb-4 font-medium opacity-90">{trimmedLine}</p>);
        }
      }
    });

    if (currentList.length > 0) {
      elements.push(<ul key="list-final" className="space-y-2 mb-6 list-none">{[...currentList]}</ul>);
    }

    return elements;
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Scores & Visualization */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 overflow-hidden relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Your 2026 Readiness Score</h2>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-black text-indigo-600">{leadData.auditResult.readinessPercentage}%</span>
                  <span className="text-gray-400 font-medium text-lg">/ 100</span>
                </div>
              </div>
              <div className={`px-6 py-4 rounded-2xl ${levelBg} flex flex-col border border-black/5 shadow-inner`}>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Maturity Status</span>
                <span className={`text-xl font-bold ${levelColor}`}>{leadData.auditResult.level} Readiness</span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                  <XAxis type="number" domain={[0, 10]} hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="score" radius={[0, 10, 10, 0]} barSize={28}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={(entry.score as number) > 7 ? '#10b981' : (entry.score as number) > 4 ? '#f59e0b' : '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-10 pt-8 border-t border-gray-100">
               <div className="flex items-start gap-4">
                 <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">How we calculate this score</h4>
                   <p className="text-sm text-gray-500 leading-relaxed">
                     Your score is derived from the 8 technical readiness factors in our 2026 Audit (Questions 6-13). Each factor is rated on a 1-5 scale across Tools, Data, People, and Processes. The final percentage reflects your business's ability to support <strong>Autonomous AI Operations</strong> without manual intervention.
                   </p>
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 min-h-[400px]">
            <div className="flex items-center justify-between mb-10 border-b border-gray-50 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">2026 Strategic Blueprint</h3>
                  <p className="text-sm text-gray-400 font-medium">Personalized analysis for {leadData.businessName}</p>
                </div>
              </div>
              {!isLoading && (
                <button 
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 transition-all no-print"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-16 h-16 relative">
                  <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-6 text-gray-500 font-bold animate-pulse tracking-wide uppercase text-xs">Synthesizing AI Strategy...</p>
              </div>
            ) : (
              <div className="max-w-none">
                {formatReportText(aiReport)}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Booking & Sticky CTA */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-200/40 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
              <h3 className="text-2xl font-black mb-6 tracking-tight leading-tight">Next Step: Claim Your 2026 Strategy Call</h3>
              <p className="text-slate-400 mb-8 text-sm leading-relaxed font-medium">
                We've identified your primary bottlenecks. On this call, we'll map out your specific 90-day implementation plan.
              </p>
              <div className="space-y-4 mb-10">
                {[
                  "Process Bottleneck Deep-Dive",
                  "Phase 1 Pilot Architecture",
                  "ROI & Efficiency Projections"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-sm font-bold text-slate-200">
                    <div className="w-5 h-5 rounded-lg bg-indigo-600 flex items-center justify-center text-[10px] shadow-lg shadow-indigo-500/20">✓</div>
                    {item}
                  </div>
                ))}
              </div>
              
              <a 
                href={CAL_COM_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full py-5 bg-white text-slate-900 font-black text-center rounded-2xl hover:bg-indigo-50 transition-all shadow-xl hover:shadow-indigo-500/10 active:scale-[0.98]"
              >
                Schedule Assessment
              </a>
              <div className="flex items-center justify-center gap-2 mt-6">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest font-black">Complimentary for Audit Completers</p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-xs font-bold text-gray-900 uppercase tracking-tight">Audit Securely Stored</div>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed font-medium">A copy of this 2026 Readiness Report has been prepared for your strategic review session.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
