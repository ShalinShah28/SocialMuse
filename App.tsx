
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CampaignForm from './components/CampaignForm';
import PostCard from './components/PostCard';
import AuthModal from './components/AuthModal';
import CampaignHistory from './components/CampaignHistory';
import { CampaignData, CampaignResult, View, User } from './types';
import { generateSocialCampaign } from './services/geminiService';
import { storageService } from './services/storageService';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [savedCampaigns, setSavedCampaigns] = useState<CampaignResult[]>([]);

  useEffect(() => {
    const currentUser = storageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setSavedCampaigns(storageService.getCampaigns(currentUser.id));
    } else {
      setSavedCampaigns(storageService.getCampaigns(null));
    }
  }, []);

  const handleGenerate = async (data: CampaignData) => {
    setIsGenerating(true);
    setError(null);
    try {
      const campaign = await generateSocialCampaign(data);
      const newCampaign: CampaignResult = {
        ...campaign,
        id: Math.random().toString(36).substr(2, 9),
        idea: data.idea,
        tone: data.tone,
        timestamp: Date.now(),
        userId: user ? user.id : null
      };
      
      setResult(newCampaign);
      storageService.saveCampaign(newCampaign);
      setSavedCampaigns(prev => [newCampaign, ...prev]);
      
    } catch (err: any) {
      console.error("Campaign generation error:", err);
      setError("Failed to generate campaign drafts. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSignOut = () => {
    storageService.setCurrentUser(null);
    setUser(null);
    setSavedCampaigns(storageService.getCampaigns(null));
    setResult(null);
    setView('home');
  };

  const handleExport = () => {
    if (!result) return;
    const content = result.posts.map(p => (
      `PLATFORM: ${p.platform}\nCONTENT: ${p.content}\nHASHTAGS: ${p.hashtags.join(', ')}\n----------------------------------------\n`
    )).join('\n');
    
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `SocialMuse-Campaign-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDeleteCampaign = (id: string) => {
    storageService.deleteCampaign(id);
    setSavedCampaigns(prev => prev.filter(c => c.id !== id));
    if (result?.id === id) setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header 
        currentView={view} 
        setView={setView} 
        user={user} 
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
        onExportAll={handleExport}
        hasResult={!!result}
      />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:py-12">
        {view === 'home' && (
          <>
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
                    <button onClick={handleExport} className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-8 rounded-xl transition-all shadow-md">
                      Export Drafts
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {view === 'campaigns' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 border-b border-slate-200 pb-4 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-slate-900">Campaign History</h2>
              <span className="text-sm font-medium text-slate-500">{savedCampaigns.length} total saved</span>
            </div>
            <CampaignHistory 
              campaigns={savedCampaigns} 
              onSelect={(c) => { setResult(c); setView('home'); }} 
              onDelete={handleDeleteCampaign}
            />
          </div>
        )}

        {view === 'assets' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 py-20 text-center">
             <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-400">
                <i className="fa-solid fa-boxes-stacked text-3xl"></i>
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Digital Asset Manager</h3>
             <p className="text-slate-500 max-w-md mx-auto">This section will contain individual saved post variations, media assets, and platform-specific templates. Currently in development.</p>
             <button onClick={() => setView('home')} className="mt-8 text-indigo-600 font-bold hover:underline">Back to Generator</button>
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

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onAuthSuccess={(u) => {
          setUser(u);
          setSavedCampaigns(storageService.getCampaigns(u.id));
        }} 
      />
    </div>
  );
};

export default App;
