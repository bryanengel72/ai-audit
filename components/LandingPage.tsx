
import React, { useState } from 'react';

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

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-indigo-600 uppercase bg-indigo-50 rounded-full">
          2026 AI Readiness Audit
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Is Your Business <span className="text-indigo-600">Truly Ready</span> for AI?
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Stop guessing. Get a professional 2026-standard diagnostic across 5 core pillars and discover exactly where your bottlenecks are holding you back.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-8 md:p-12 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input 
                required
                type="text" 
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-black"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input 
                required
                type="email" 
                placeholder="john@company.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-black"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
            <input 
              required
              type="text" 
              placeholder="Acme Inc."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-black"
              value={formData.businessName}
              onChange={(e) => setFormData({...formData, businessName: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5"
          >
            Start Your 2026 AI Audit →
          </button>
          <p className="text-center text-sm text-gray-400">
            Takes ~4 minutes. Get your roadmap instantly.
          </p>
        </form>
      </div>

      <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
        {[
          { title: "2026 Benchmarks", desc: "Get a readiness rating based on the latest 2026 AI adoption standards." },
          { title: "Gap Analysis", desc: "Identify if you're in the Foundation, Automation, or Autonomous Phase." },
          { title: "Action Plan", desc: "Receive custom recommendations to fix bottlenecks before your competitors do." }
        ].map((feat, i) => (
          <div key={i} className="p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{feat.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
