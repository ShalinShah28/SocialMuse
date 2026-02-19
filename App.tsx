
import React, { useState } from 'react';
import Header from './components/Header';
import CampaignForm from './components/CampaignForm';
import PostCard from './components/PostCard';
import ApiKeyGuard from './components/ApiKeyGuard';
import { CampaignData, CampaignResult, ImageSize } from './types';
import { generateSocialCampaign } from './services/geminiService';

const App: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [activeSize, setActiveSize] = useState<ImageSize>('1K');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (data: CampaignData) => {
    setIsGenerating(true);
    setError(null);
    setActiveSize(data.imageSize);
    try {
      const campaign = await generateSocialCampaign(data);
      setResult(campaign);
    } catch (err) {
      console.error(err);
      setError("Failed to generate campaign drafts. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ApiKeyGuard>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:py-12">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              AI-Powered Content Engine
            </h1>
            <p className="text-lg text-slate-600">
              One idea. Three platforms. Professional results. 
              Draft your strategy and generate high-fidelity 4K visuals in seconds.
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
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
              <div className="flex items