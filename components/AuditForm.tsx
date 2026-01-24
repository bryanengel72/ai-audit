
import React, { useState } from 'react';
import { QUESTIONS } from '../constants';
import { UserResponse } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  userName: string;
  onComplete: (responses: UserResponse[]) => void;
}

const AuditForm: React.FC<Props> = ({ userName, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [textValue, setTextValue] = useState('');
  const [direction, setDirection] = useState(0);

  const question = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  const handleOptionSelect = (option: { text: string; score: number }) => {
    const newResponses = [...responses];
    newResponses[currentStep] = {
      questionId: question.id,
      selectedOption: option
    };
    setResponses(newResponses);

    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => {
        setDirection(1);
        setCurrentStep(prev => prev + 1);
        setTextValue(responses[currentStep + 1]?.textResponse || '');
      }, 300);
    } else {
      onComplete(newResponses);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textValue.trim()) return;

    const newResponses = [...responses];
    newResponses[currentStep] = {
      questionId: question.id,
      textResponse: textValue
    };
    setResponses(newResponses);

    if (currentStep < QUESTIONS.length - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
      setTextValue(responses[currentStep + 1]?.textResponse || '');
    } else {
      onComplete(newResponses);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setTextValue(responses[prevStep]?.textResponse || '');
    }
  };

  // Modern Animation Variants
  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 20 : -20,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: (direction: number) => ({
      y: direction < 0 ? 20 : -20,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3, ease: "easeIn" }
    })
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-slate-900 relative overflow-hidden">
      {/* Abstract Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-16 relative z-10 items-center">

        {/* Left Col: Static Content Info */}
        <div className="hidden lg:flex flex-col justify-center text-white pl-8">
          <div className="mb-8">
            <motion.span
              key={question.pillar}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              {question.pillar}
            </motion.span>
          </div>
          <AnimatePresence mode='wait'>
            <motion.h1
              key={question.pillar}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-6xl font-extrabold leading-tight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-white to-blue-200"
            >
              {question.pillar === 'Strategy' ? "Align your vision." :
                question.pillar === 'Processes' ? "Find the friction." :
                  question.pillar === 'People' ? "Team readiness." :
                    question.pillar === 'Tools' ? "Stack evaluation." :
                      question.pillar === 'Data' ? "Data driven." :
                        "Discovery"}
            </motion.h1>
          </AnimatePresence>

          <p className="text-xl text-blue-200/60 font-light leading-relaxed max-w-md mb-12">
            Step {currentStep + 1} of {QUESTIONS.length} <br />
            <span className="text-sm opacity-50">Calibrating your {question.pillar.toLowerCase()} metrics...</span>
          </p>

          <div className="flex items-center gap-6">
            <div className="h-1.5 w-48 bg-blue-900/40 rounded-full overflow-hidden backdrop-blur-md border border-white/5">
              <motion.div
                className="h-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-sm font-mono text-blue-300 tabular-nums">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Right Col: Interactive Card */}
        <div className="relative w-full">
          <AnimatePresence mode='wait' custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="bg-slate-800/40 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
            >
              {/* Internal subtle glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent blur-sm" />

              {/* Mobile Progress (Visible only on small screens) */}
              <div className="lg:hidden mb-8 flex items-center gap-4">
                <div className="flex-grow h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-blue-500" animate={{ width: `${progress}%` }} />
                </div>
                <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">{question.pillar}</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 leading-snug">
                {question.question.replace('{userName}', userName)}
              </h2>

              <div className="space-y-4 relative z-10">
                {question.type === 'scored' ? (
                  question.options?.map((option, idx) => {
                    const isSelected = responses[currentStep]?.selectedOption?.text === option.text;
                    return (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleOptionSelect(option)}
                        className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group flex items-center justify-between relative overflow-hidden ${isSelected
                            ? 'bg-blue-600 border-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.3)]'
                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-blue-400/20'
                          }`}
                      >
                        <span className={`text-lg font-medium relative z-10 transition-colors ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                          {option.text}
                        </span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-lg"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })
                ) : (
                  <form onSubmit={handleTextSubmit}>
                    <div className="group relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl opacity-0 group-focus-within:opacity-100 blur transition duration-500 ease-in-out"></div>
                      <textarea
                        required
                        autoFocus
                        className="relative w-full h-48 p-6 bg-slate-900 border border-white/10 rounded-2xl focus:outline-none text-white text-lg resize-none placeholder-slate-600 shadow-inner"
                        placeholder={question.placeholder}
                        value={textValue}
                        onChange={(e) => setTextValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleTextSubmit(e);
                          }
                        }}
                      />
                    </div>
                    <div className="mt-4 flex justify-between items-center text-xs text-slate-500 uppercase tracking-wider font-bold">
                      <span>Press Enter ↵</span>
                      <span>{textValue.length} / 500 chars</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="mt-6 w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      Continue
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </motion.button>
                  </form>
                )}
              </div>

            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-center lg:justify-start">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-white/5 text-sm font-bold text-slate-500 hover:text-white disabled:opacity-0 transition-all uppercase tracking-wide"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous Step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditForm;
