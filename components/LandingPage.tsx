
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onStart: (info: { name: string; email: string; businessName: string }) => void;
}

const LandingPage: React.FC<Props> = ({ onStart }) => {
  const [formData, setFormData] = useState({ name: '', email: '', businessName: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.businessName) {
      onStart(formData);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 40, damping: 15 }
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden flex flex-col justify-center py-12 bg-slate-900">
      {/* Abstract Background Blobs - Matching AuditForm */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px]"
        />
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Column: Hero Copy */}
        <div className="text-left space-y-8">
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-sm font-bold uppercase tracking-wider backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              2026 AI Readiness Protocol
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]"
          >
            Future-Proof <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white">Your Business.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-blue-100/60 max-w-xl leading-relaxed font-light"
          >
            A brutal but necessary diagnostic. Get a professional breakdown of your bottleneck across 5 core pillars.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-6 pt-4 border-t border-white/10"
          >
            {[
              { label: "Completion Time", val: "4 Min" },
              { label: "Cost", val: "$0.00" },
              { label: "Format", val: "PDF Report" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white font-mono">{stat.val}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Column: Glass Form */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-800/40 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-black/20 relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-[2.5rem] pointer-events-none" />

          <h3 className="text-2xl font-bold text-white mb-2">Begin Diagnostic</h3>
          <p className="text-slate-400 mb-8 text-sm">Enter your details to initialize the audit agent.</p>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-bold text-blue-300 uppercase tracking-wide ml-1">Full Name</label>
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition duration-500"></div>
                <input
                  required
                  type="text"
                  placeholder="John Doe"
                  className="relative w-full px-5 py-4 bg-slate-900 border border-white/10 rounded-xl focus:outline-none text-white placeholder-slate-600 font-medium transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-blue-300 uppercase tracking-wide ml-1">Email Address</label>
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition duration-500"></div>
                <input
                  required
                  type="email"
                  placeholder="john@company.com"
                  className="relative w-full px-5 py-4 bg-slate-900 border border-white/10 rounded-xl focus:outline-none text-white placeholder-slate-600 font-medium transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-blue-300 uppercase tracking-wide ml-1">Company</label>
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition duration-500"></div>
                <input
                  required
                  type="text"
                  placeholder="Acme Inc."
                  className="relative w-full px-5 py-4 bg-slate-900 border border-white/10 rounded-xl focus:outline-none text-white placeholder-slate-600 font-medium transition-all"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(37, 99, 235, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-5 mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-3 border border-blue-400/20"
            >
              Start Audit
              <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
