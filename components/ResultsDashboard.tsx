
import React, { useEffect, useState } from 'react';
import { LeadData } from '../types';
import { CAL_COM_LINK } from '../constants';
import { generateAuditReport } from '../services/geminiService';
import { submitToDatabase } from '../services/storageService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { jsPDF } from 'jspdf';
import { motion } from 'framer-motion';

interface Props {
  leadData: LeadData;
}

const ResultsDashboard: React.FC<Props> = ({ leadData }) => {
  const [aiReport, setAiReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Fake progress for loading state
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingProgress(prev => (prev >= 90 ? 90 : prev + 1));
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    const processResults = async () => {
      setIsLoading(true);
      await submitToDatabase(leadData);
      const report = await generateAuditReport(leadData);
      setAiReport(report);
      setLoadingProgress(100);
      setTimeout(() => setIsLoading(false), 500); // Small buffer to show 100%
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
          elements.push(<ul key={`list-${i}`} className="space-y-3 mb-8 pl-4 border-l-2 border-indigo-100">{[...currentList]}</ul>);
          currentList = [];
        }
        elements.push(
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            key={`h3-${i}`}
            className="text-xl font-bold text-slate-900 mt-12 mb-6 flex items-center gap-3 first:mt-0"
          >
            <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg">#</span>
            {trimmedLine.replace('###', '').trim()}
          </motion.h3>
        );
      }
      // Handle List Items
      else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        currentList.push(
          <li key={`li-${i}`} className="flex gap-4 text-slate-700 leading-relaxed group">
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:bg-indigo-600 transition-colors flex-shrink-0" />
            <span>{trimmedLine.replace(/^[-*]\s*/, '').trim()}</span>
          </li>
        );
      }
      // Handle Paragraphs/Empty space
      else {
        if (currentList.length > 0) {
          elements.push(<ul key={`list-${i}`} className="space-y-3 mb-8 pl-4 border-l-2 border-indigo-100">{[...currentList]}</ul>);
          currentList = [];
        }
        if (trimmedLine === '') {
          elements.push(<div key={`space-${i}`} className="h-4" />);
        } else {
          elements.push(
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              key={`p-${i}`}
              className="text-slate-600 leading-relaxed mb-6 font-medium"
            >
              {trimmedLine}
            </motion.p>
          );
        }
      }
    });

    if (currentList.length > 0) {
      elements.push(<ul key="list-final" className="space-y-3 mb-6 pl-4 border-l-2 border-indigo-100">{[...currentList]}</ul>);
    }

    return elements;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-12 gap-8">

        {/* Left Column: Scores & Visualization */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">2026 AI Readiness Score</h2>
                <div className="flex items-baseline gap-4">
                  <span className="text-7xl font-black text-slate-900 tracking-tighter">{leadData.auditResult.readinessPercentage}%</span>
                  <div className={`px-4 py-1.5 rounded-full ${levelBg} border border-slate-100`}>
                    <span className={`text-sm font-bold ${levelColor} uppercase tracking-wide`}>{leadData.auditResult.level}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-64 w-full mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30, bottom: 0, top: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 10]} hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={100}
                    tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }}
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={32} animationDuration={1500}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={(entry.score as number) > 7 ? '#10b981' : (entry.score as number) > 4 ? '#f59e0b' : '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                <div className="text-2xl">💡</div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Score Breakdown</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Your score reflects {leadData.auditResult.pillarScores && Object.keys(leadData.auditResult.pillarScores).length} key operational dimensions. A score below 70% typically indicates significant opportunity for automation-led growth.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-10 shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[500px]"
          >
            <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-8">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 text-white">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Executive Strategy Blueprint</h3>
                  <p className="text-sm text-slate-500 font-medium">Generated for {leadData.businessName}</p>
                </div>
              </div>
              {!isLoading && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-slate-200 no-print"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Report
                </motion.button>
              )}
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-full max-w-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Analysing Data Points...</span>
                    <span className="text-xs font-bold text-slate-400">{loadingProgress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-indigo-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                </div>
                <p className="mt-8 text-slate-500 font-medium animate-pulse text-sm">
                  Our AI is cross-referencing your answers with 2026 benchmarks...
                </p>
              </div>
            ) : (
              <div className="prose prose-slate max-w-none">
                {formatReportText(aiReport)}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column: Booking & Sticky CTA */}
        <div className="lg:col-span-4">
          <div className="sticky top-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-200/40 relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>

              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-indigo-500/20 rounded-lg text-xs font-bold text-indigo-300 uppercase tracking-wider mb-6 border border-indigo-500/30">
                  Recommended Next Step
                </span>
                <h3 className="text-2xl font-black mb-4 tracking-tight leading-tight">Claim Your Strategy Session</h3>
                <p className="text-slate-400 mb-8 text-sm leading-relaxed font-medium border-l-2 border-indigo-500/30 pl-4">
                  We've identified your primary bottlenecks. Let's map out your specific 90-day implementation plan.
                </p>
                <div className="space-y-4 mb-10">
                  {[
                    "Process Bottleneck Deep-Dive",
                    "Phase 1 Pilot Architecture",
                    "ROI & Efficiency Projections"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 border border-green-500/20">✓</div>
                      {item}
                    </div>
                  ))}
                </div>

                <a
                  href={CAL_COM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 bg-white text-slate-900 font-black text-center rounded-xl hover:bg-slate-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Schedule Free Assessment
                </a>
                <div className="flex items-center justify-center gap-2 mt-6">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest font-black">Complimentary for Audit Completers</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-xs font-bold text-slate-900 uppercase tracking-tight">Audit Securely Stored</div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">A copy of this 2026 Readiness Report has been prepared for your strategic review session.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
