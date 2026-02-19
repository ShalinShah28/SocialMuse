
import React from 'react';
import { SocialPost } from '../types';

interface PostCardProps {
  post: SocialPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const platformIcons = {
    LinkedIn: <i className="fa-brands fa-linkedin text-blue-700"></i>,
    Twitter: <i className="fa-brands fa-x-twitter text-slate-900"></i>,
    Instagram: <i className="fa-brands fa-instagram text-pink-600"></i>,
  };

  const copyToClipboard = () => {
    const text = `${post.content}\n\n${post.hashtags.map(h => `#${h.replace(/^#/, '')}`).join(' ')}`;
    navigator.clipboard.writeText(text);
    alert(`${post.platform} content copied!`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full group transition-all hover:shadow-md">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl">
            {platformIcons[post.platform]}
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{post.platform}</h3>
            <span className="text-xs text-slate-500">Draft Content</span>
          </div>
        </div>
        <button 
          onClick={copyToClipboard}
          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" 
          title="Copy Content"
        >
          <i className="fa-solid fa-copy"></i>
        </button>
      </div>

      <div className="p-6 flex-1 space-y-4">
        <p className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {post.hashtags.map((tag, i) => (
            <span key={i} className="px-2 py-1 bg-slate-50 rounded text-indigo-600 text-xs font-semibold">
              #{tag.replace(/^#/, '')}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
