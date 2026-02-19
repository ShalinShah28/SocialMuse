
import React from 'react';
import { CampaignResult } from '../types';

interface CampaignHistoryProps {
  campaigns: CampaignResult[];
  onSelect: (campaign: CampaignResult) => void;
  onDelete: (id: string) => void;
}

const CampaignHistory: React.FC<CampaignHistoryProps> = ({ campaigns, onSelect, onDelete }) => {
  if (campaigns.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
          <i className="fa-solid fa-folder-open text-3xl"></i>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No Campaigns Found</h3>
        <p className="text-slate-500">Start by generating your first campaign on the Home screen.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((c) => (
        <div key={c.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
              {c.tone}
            </span>
            <button 
              onClick={() => onDelete(c.id)}
              className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <i className="fa-solid fa-trash-can text-sm"></i>
            </button>
          </div>
          <h4 className="font-bold text-slate-900 mb-2 line-clamp-2 h-12">{c.idea}</h4>
          <p className="text-xs text-slate-400 mb-4">
            {new Date(c.timestamp).toLocaleDateString()} at {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <button 
            onClick={() => onSelect(c)}
            className="w-full bg-slate-50 text-slate-700 font-bold py-2 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all text-sm"
          >
            View Drafts
          </button>
        </div>
      ))}
    </div>
  );
};

export default CampaignHistory;
