
import React, { useState } from 'react';
import { CampaignData, Tone, ImageSize } from '../types';

interface CampaignFormProps {
  onGenerate: (data: CampaignData) => void;
  isGenerating: boolean;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ onGenerate, isGenerating }) => {
  const [idea, setIdea] = useState('');
  const [tone, setTone] = useState<Tone>('Professional');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    onGenerate({ idea, tone, imageSize });
  };

  const tones: Tone[] = ['Professional', 'Witty', 'Urgent', 'Inspirational', 'Informative'];
  const sizes: ImageSize[] = ['1K', '2K', '4K'];

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
            placeholder="e.g., Launching a new eco-friendly water bottle line made from ocean plastic..."
            className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Desired Tone</label>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
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

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Image Quality (Size)</label>
            <div className="flex gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setImageSize(s)}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    imageSize === s
                      ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-500'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
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
          {isGenerating ? 'Generating Campaign...' : 'Generate Multi-Platform Campaign'}
        </button>
      </form>
    </div>
  );
};

export default CampaignForm;
