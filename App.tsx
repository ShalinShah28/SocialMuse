
import React, { useState } from 'react';
import Header from './components/Header';
import CampaignForm from './components/CampaignForm';
import PostCard from './components/PostCard';
import { CampaignData, CampaignResult } from './types';
import { generateSocialCampaign } from './services/geminiService';

const App: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (data: CampaignData) => {
    setIsGenerating(true);
    setError(null);
    try {
      const campaign = await generateSocialCampaign(data);
      setResult(campaign);
    } catch (err: any) {
      console.error("Campaign generation error:", err);
      setError("Failed to generate campaign drafts. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            AI-Powered Content Engine
          </h1>
          <p className="text-lg text-slate-600">
            One idea. Three platforms. Professional results. 
            Draft your strategy and generate platform-optimized content in seconds.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <CampaignForm onGenerate={handleGenerate} isGenerating={isGenerating} />
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </div>
          )}
        </div>

        {result && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-bold text-slate-900">Your Generated Campaign</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {result.posts.map((post, idx) => (
                <PostCard key={idx} post={post} />
              ))}
            </div>

            <div className="bg-indigo-600 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-100">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-xl font-bold">Ready to publish?</h3>
                <p className="text-indigo-100">Copy your drafts and schedule your posts now.</p>
              </div>
              <div className="flex gap-3">
                <button className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-8 rounded-xl transition-all shadow-md">
                  Export Drafts
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            &copy; 2024 SocialMuse AI. Powered by Google Gemini 3.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
