
import React, { useState, useEffect } from 'react';

interface ApiKeyGuardProps {
  children: React.ReactNode;
}

const ApiKeyGuard: React.FC<ApiKeyGuardProps> = ({ children }) => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    // @ts-ignore
    const selected = await window.aistudio.hasSelectedApiKey();
    setHasKey(selected);
  };

  const handleSelectKey = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    // Assume success after triggering the dialog to avoid race condition
    setHasKey(true);
  };

  if (hasKey === null) return null;

  if (!hasKey) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-key text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Billing Required</h2>
          <p className="text-slate-600 mb-6">
            To use the High-Quality Image Generation (Gemini 3 Pro Image), you must select a Gemini API key from a paid Google Cloud project.
          </p>
          <button
            onClick={handleSelectKey}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors mb-4"
          >
            Select Paid API Key
          </button>
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:underline flex items-center justify-center gap-1"
          >
            Learn about Gemini billing <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ApiKeyGuard;
