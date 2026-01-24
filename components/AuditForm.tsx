
import React, { useState } from 'react';
import { QUESTIONS } from '../constants';
import { UserResponse } from '../types';

interface Props {
  userName: string;
  onComplete: (responses: UserResponse[]) => void;
}

const AuditForm: React.FC<Props> = ({ userName, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [textValue, setTextValue] = useState('');
  
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
      setCurrentStep(prev => prev + 1);
      setTextValue(responses[currentStep + 1]?.textResponse || '');
    } else {
      onComplete(newResponses);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setTextValue(responses[prevStep]?.textResponse || '');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Step {currentStep + 1} of {QUESTIONS.length}</span>
          <span className="text-sm font-medium text-gray-400">{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 min-h-[480px] flex flex-col">
        <div className="mb-4">
          <span className="text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md uppercase tracking-tight">
            {question.pillar}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-tight">
          {question.question}
        </h2>

        <div className="flex-grow">
          {question.type === 'scored' ? (
            <div className="space-y-3">
              {question.options?.map((option, idx) => {
                const isSelected = responses[currentStep]?.selectedOption?.text === option.text;
                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50 shadow-sm' 
                        : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 mr-4 flex-shrink-0 flex items-center justify-center ${
                        isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <span className={`font-medium ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>
                        {option.text}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleTextSubmit} className="space-y-4">
              <textarea
                required
                autoFocus
                className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-black resize-none"
                placeholder={question.placeholder}
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
              />
              <button 
                type="submit"
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all"
              >
                Continue →
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center">
          <button 
            onClick={handleBack}
            disabled={currentStep === 0}
            className="text-sm font-semibold text-gray-400 hover:text-indigo-600 disabled:opacity-0 transition-all"
          >
            ← Back
          </button>
          <span className="text-xs text-gray-300">Step {currentStep + 1} / {QUESTIONS.length}</span>
        </div>
      </div>
    </div>
  );
};

export default AuditForm;
