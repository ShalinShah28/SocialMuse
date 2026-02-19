
import React, { useEffect, useState } from 'react';
import { SocialPost, ImageSize } from '../types';
import { generatePostImage } from '../services/geminiService';

interface PostCardProps {
  post: SocialPost;
  imageSize: ImageSize;
}

const PostCard: React.FC<PostCardProps> = ({ post, imageSize }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = await generatePostImage(post.suggestedPrompt, post.aspectRatio, imageSize);
        setImageUrl(url);
      } catch (err: any) {
        console.error(err);
        if (err.message?.includes("Requested entity was not found")) {
           // Reset key selection if we hit the race condition or stale key
           // @ts-ignore
           window.aistudio.openSelectKey();
        }
        setError("Failed to generate image.");
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [post.suggestedPrompt, post.aspectRatio, imageSize]);

  const platformIcons = {
    LinkedIn: <i className="fa-brands fa-linkedin text-blue-700"></i>,
    Twitter: <i className="fa-brands fa-x-twitter text-slate-900"></i>,
    Instagram: <i className="fa-brands fa-instagram text-pink-600"></i>,
  };

  const getContainerStyle = () => {
    switch (post.aspectRatio) {
      case '1:1': return 'aspect-square';
      case '4:3': return 'aspect-[4/3]';
      case '16:9': return 'aspect-video';
      case '9:16': return 'aspect-[9/16]';
      case '3:4': return 'aspect-[3/4]';
      default: return 'aspect-video';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full group">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl">
            {platformIcons[post.platform]}
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{post.platform}</h3>
            <span className="text-xs text-slate-500">{post.aspectRatio} Optimization</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <i className="fa-solid fa-copy"></i>
          </button>
          <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <i className="fa-solid fa-download"></i>
          </button>
        </div>
      </div>

      <div className="p-5 flex-1 space-y-4">
        <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
        <div className="flex flex-wrap gap-2">
          {post.hashtags.map((tag, i) => (
            <span key={i} className="text-indigo-600 text-xs font-semibold">#{tag.replace(/^#/, '')}</span>
          ))}
        </div>
      </div>

      <div className={`relative bg-slate-100 overflow-hidden ${getContainerStyle()}`}>
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400">
            <i className="fa-solid fa-circle-notch animate-spin text-2xl mb-2"></i>
            <span className="text-xs font-medium">Drawing {imageSize} Masterpiece...</span>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-slate-400">
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <img
            src={imageUrl || ''}
            alt={post.platform}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        )}
      </div>
    </div>
  );
};

export default PostCard;
