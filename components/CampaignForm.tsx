
import React, { useState } from 'react';
import { CampaignData, Tone } from '../types';

interface CampaignFormProps {
  onGenerate: (data: CampaignData) => void;
  isGenerating: boolean;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ onGenerate, isGenerating }) => {
  const [idea, setIdea] = useState('');
  const [tone, setTone] = useState<Tone>('Professional');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    onGenerate({ idea, tone });
  };

  const tones: Tone[] = ['Professional', 'Witty', 'Urgent', 'Inspirational', 'Informative'];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            What's your idea or campaign goal?
          </label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g., Launching a new eco-friendly water bottle line..."
            className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Desired Tone</label>
          <div className="flex flex-wrap gap-2">
            {tones.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tone === t
                    ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-500'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
        >
          {isGenerating ? (
            <i className="fa-solid fa-circle-notch animate-spin"></i>
          ) : (
            <i className="fa-solid fa-sparkles text-indigo-400 group-hover:scale-110 transition-transform"></i>
          )}
          {isGenerating ? 'Generating Drafts...' : 'Generate Multi-Platform Campaign'}
        </button>
      </form>
    </div>
  );
};

export default CampaignForm;
