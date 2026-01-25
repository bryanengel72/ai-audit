import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CAL_COM_LINK } from '../constants';
import { LeadData } from '../types';
import Cal, { getCalApi } from "@calcom/embed-react";
import { generateAuditReport } from '../services/geminiService';
import { submitToDatabase } from '../services/storageService';
import { sendReportEmail } from '../services/emailService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { jsPDF } from 'jspdf';

interface Props {
    leadData: LeadData;
}

const BookingScreen: React.FC<Props> = ({ leadData }) => {
    const [aiReport, setAiReport] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [emailSending, setEmailSending] = useState(false);
    const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        (async function () {
            const cal = await getCalApi({});
            cal("ui", { "styles": { "branding": { "brandColor": "#2563eb" } }, "hideEventTypeDetails": false, "layout": "month_view" });
        })();
    }, []);

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
            const report = await generateAuditReport(leadData);
            setAiReport(report);
            setLoadingProgress(100);
            setTimeout(() => setIsLoading(false), 500);

            // Save report to Supabase
            await submitToDatabase(leadData, report);

            // AUTO-SEND: Notify Admin
            sendReportEmail({
                email: 'thebryanengel@gmail.com',
                name: leadData.name,
                businessName: leadData.businessName,
                report: report,
                score: leadData.auditResult.readinessPercentage,
                level: leadData.auditResult.level,
            }).catch(err => console.error("Admin notification failed", err));

            // AUTO-SEND: Notify Lead
            if (leadData.email) {
                sendReportEmail({
                    email: leadData.email,
                    name: leadData.name,
                    businessName: leadData.businessName,
                    report: report,
                    score: leadData.auditResult.readinessPercentage,
                    level: leadData.auditResult.level,
                }).catch(err => console.error("Lead notification failed", err));
            }
        };
        processResults();
    }, [leadData]);

    const handleEmailReport = async () => {
        setEmailSending(true);
        setEmailStatus('idle');

        const result = await sendReportEmail({
            email: leadData.email,
            name: leadData.name,
            businessName: leadData.businessName,
            report: aiReport,
            score: leadData.auditResult.readinessPercentage,
            level: leadData.auditResult.level,
        });

        setEmailSending(false);
        setEmailStatus(result.success ? 'success' : 'error');

        // Reset status after 3 seconds
        setTimeout(() => setEmailStatus('idle'), 3000);
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const margin = 20;
        let y = 20;
        const pageWidth = 170; // Width for text wrapping

        // Header
        doc.setFontSize(22);
        doc.setTextColor(37, 99, 235); // Blue 600
        doc.text('2026 AI Readiness Audit', margin, y);
        y += 10;

        doc.setFontSize(12);
        doc.setTextColor(100, 116, 139); // Slate 500
        doc.text(`Client: ${leadData.name} | Business: ${leadData.businessName}`, margin, y);
        y += 8;
        doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, y);
        y += 15;

        // Score Badge
        doc.setFillColor(248, 250, 252); // Slate 50
        doc.roundedRect(margin, y, pageWidth, 25, 3, 3, 'F');

        doc.setFontSize(16);
        doc.setTextColor(15, 23, 42); // Slate 900
        doc.text(`Score: ${leadData.auditResult.readinessPercentage}%`, margin + 5, y + 10);

        doc.setFontSize(12);
        doc.setTextColor(71, 85, 105); // Slate 600
        doc.text(`Readiness Level: ${leadData.auditResult.level}`, margin + 5, y + 18);
        y += 35;

        // Content Parsing
        doc.setTextColor(30, 41, 59); // Slate 800
        const lines = aiReport.split('\n');

        lines.forEach((line) => {
            const trimmed = line.trim();
            if (!trimmed) return;

            // Check for page break
            if (y > 270) {
                doc.addPage();
                y = 20;
            }

            // Headers (###)
            if (trimmed.startsWith('###')) {
                const headerText = trimmed.replace('###', '').trim();
                y += 5;
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(37, 99, 235); // Blue 600
                doc.text(headerText, margin, y);
                y += 8;
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(30, 41, 59);
            }
            // List items (- or *)
            else if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
                const bulletText = trimmed.replace(/^[-*]\s*/, '').replace(/\*\*/g, ''); // Remove markup
                doc.setFontSize(11);

                // Draw bullet
                doc.setFillColor(37, 99, 235);
                doc.circle(margin + 2, y - 1, 1, 'F');

                // Draw text with wrapping
                const wrappedText = doc.splitTextToSize(bulletText, pageWidth - 10);
                doc.text(wrappedText, margin + 8, y);
                y += (wrappedText.length * 6) + 2;
            }
            // Normal paragraphs
            else {
                const cleanText = trimmed.replace(/\*\*/g, ''); // Remove bold markers
                doc.setFontSize(11);
                const wrappedText = doc.splitTextToSize(cleanText, pageWidth);
                doc.text(wrappedText, margin, y);
                y += (wrappedText.length * 6) + 4;
            }
        });

        doc.save(`AI_Readiness_Audit_${leadData.businessName.replace(/\s+/g, '_')}.pdf`);
    };

    const chartData: { name: string; score: number }[] = Object.entries(leadData.auditResult.pillarScores).map(([name, score]) => ({
        name: name.split('&')[0].trim(),
        score: score as number
    }));

    const levelColor = leadData.auditResult.level === 'High' ? 'text-emerald-400' : leadData.auditResult.level === 'Medium' ? 'text-amber-400' : 'text-rose-400';
    const levelBg = leadData.auditResult.level === 'High' ? 'bg-emerald-500/20' : leadData.auditResult.level === 'Medium' ? 'bg-amber-500/20' : 'bg-rose-500/20';

    const formatReportText = (text: string) => {
        const lines = text.split('\n');
        const elements: React.ReactNode[] = [];
        let currentList: React.ReactNode[] = [];

        // Helper to parse bold text **like this** and *italic*
        const parseLine = (lineContent: string): React.ReactNode[] => {
            const parts: React.ReactNode[] = [];
            let currentIndex = 0;

            // Match **bold** patterns
            const boldRegex = /\*\*(.+?)\*\*/g;
            let match;
            let lastIndex = 0;

            while ((match = boldRegex.exec(lineContent)) !== null) {
                // Add text before the match
                if (match.index > lastIndex) {
                    parts.push(lineContent.substring(lastIndex, match.index));
                }
                // Add the bold text
                parts.push(
                    <strong key={`bold-${match.index}`} className="text-white font-bold">
                        {match[1]}
                    </strong>
                );
                lastIndex = match.index + match[0].length;
            }

            // Add remaining text
            if (lastIndex < lineContent.length) {
                parts.push(lineContent.substring(lastIndex));
            }

            return parts.length > 0 ? parts : [lineContent];
        };

        lines.forEach((line, i) => {
            const trimmedLine = line.trim();

            // Handle Headers (###)
            if (trimmedLine.startsWith('###')) {
                if (currentList.length > 0) {
                    elements.push(
                        <ul key={`list-${i}`} className="space-y-3 mb-6 pl-4 border-l-2 border-blue-500/30">
                            {[...currentList]}
                        </ul>
                    );
                    currentList = [];
                }
                const headerText = trimmedLine.replace('###', '').trim();
                elements.push(
                    <motion.h3
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(i * 0.02, 1) }}
                        key={`h3-${i}`}
                        className="text-xl font-bold text-blue-300 mt-10 mb-5 flex items-center gap-3 first:mt-0"
                    >
                        <span className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400 text-sm">#</span>
                        {headerText}
                    </motion.h3>
                );
            }
            // Handle List Items (- or *)
            else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
                const content = trimmedLine.replace(/^[-*]\s*/, '');
                currentList.push(
                    <li key={`li-${i}`} className="flex gap-3 text-slate-300 leading-relaxed group">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 group-hover:scale-150 transition-transform" />
                        <span className="text-sm">{parseLine(content)}</span>
                    </li>
                );
            }
            // Handle Paragraphs/Empty space
            else {
                if (currentList.length > 0) {
                    elements.push(
                        <ul key={`list-${i}`} className="space-y-3 mb-6 pl-4 border-l-2 border-blue-500/30">
                            {[...currentList]}
                        </ul>
                    );
                    currentList = [];
                }
                if (trimmedLine === '') {
                    elements.push(<div key={`space-${i}`} className="h-4" />);
                } else {
                    elements.push(
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: Math.min(i * 0.02, 1) }}
                            key={`p-${i}`}
                            className="text-slate-300 leading-relaxed mb-5 text-base"
                        >
                            {parseLine(trimmedLine)}
                        </motion.p>
                    );
                }
            }
        });

        if (currentList.length > 0) {
            elements.push(
                <ul key="list-final" className="space-y-3 mb-6 pl-4 border-l-2 border-blue-500/30">
                    {[...currentList]}
                </ul>
            );
        }

        return elements;
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex bg-brand-dark relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 p-6 lg:p-12 h-[calc(100vh-80px)]">

                {/* Left Results Column - Scrollable */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-brand-gray/50 scrollbar-track-transparent"
                >
                    <div className="space-y-8 pb-12">
                        {/* Score Card */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                                <div>
                                    <h2 className="text-xs font-bold font-heading text-brand-gray uppercase tracking-widest mb-1">2026 AI Readiness Score</h2>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-5xl font-black font-heading text-white tracking-tighter">{leadData.auditResult.readinessPercentage}%</span>
                                        <div className={`px-3 py-1 rounded-full ${levelBg} border border-white/5`}>
                                            <span className={`text-xs font-bold ${levelColor} uppercase tracking-wide`}>{leadData.auditResult.level}</span>
                                        </div>
                                    </div>
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex gap-2"
                                >
                                    {!isLoading && (
                                        <>
                                            <button
                                                onClick={handleDownloadPDF}
                                                className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-calm text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-brand-primary/25 font-heading"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                Download
                                            </button>
                                            <button
                                                onClick={handleEmailReport}
                                                disabled={emailSending}
                                                className={`flex items-center gap-2 px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg ${emailStatus === 'success'
                                                    ? 'bg-green-600 text-white'
                                                    : emailStatus === 'error'
                                                        ? 'bg-red-600 text-white'
                                                        : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200'
                                                    } ${emailSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {emailSending ? (
                                                    <>
                                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Sending...
                                                    </>
                                                ) : emailStatus === 'success' ? (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Sent!
                                                    </>
                                                ) : emailStatus === 'error' ? (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Failed
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                        Email Report
                                                    </>
                                                )}
                                            </button>
                                        </>
                                    )}
                                </motion.div>
                            </div>

                            {/* Chart */}
                            <div className="h-48 w-full mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30, bottom: 0, top: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                                        <XAxis type="number" domain={[0, 10]} hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            axisLine={false}
                                            tickLine={false}
                                            width={100}
                                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                        />
                                        <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20} animationDuration={1000}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={(entry.score as number) > 7 ? '#10b981' : (entry.score as number) > 4 ? '#f59e0b' : '#3b82f6'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <p className="text-brand-sky/80 text-sm leading-relaxed border-t border-white/5 pt-4 font-accent">
                                {leadData.auditResult.recommendation}
                            </p>
                        </div>

                        {/* Report Content */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl min-h-[400px]">
                            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-calm rounded-lg flex items-center justify-center shadow-lg text-white">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold font-heading text-white">Executive Strategy Blueprint</h3>
                                    <p className="text-xs text-brand-gray font-accent">AI-Generated Analysis</p>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="w-full max-w-xs mb-4">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Analysing...</span>
                                            <span className="text-[10px] font-bold text-slate-500">{loadingProgress}%</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-blue-500"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${loadingProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-slate-500 text-xs animate-pulse">
                                        Generating your custom roadmap...
                                    </p>
                                </div>
                            ) : (
                                <div className="prose prose-invert prose-sm max-w-none">
                                    {formatReportText(aiReport)}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Right Calendar Column - Sticky/Fixed */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="h-full flex flex-col"
                >
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm">📅</span>
                            Schedule Your Strategy Session
                        </h3>
                        <span className="text-xs text-blue-400 font-medium uppercase tracking-wider animate-pulse">Required Next Step</span>
                    </div>

                    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl h-full relative border border-white/10">
                        <Cal
                            calLink={CAL_COM_LINK.replace("https://cal.com/", "")}
                            style={{ width: "100%", height: "100%", overflow: "scroll" }}
                            config={{
                                name: leadData.name,
                                email: leadData.email,
                                notes: `Business: ${leadData.businessName} | Readiness: ${leadData.auditResult.readinessPercentage}%`
                            }}
                        />
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default BookingScreen;
