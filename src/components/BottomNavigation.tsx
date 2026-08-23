import React from 'react';
import { Home, Heart, Plus, MessageSquare, User } from 'lucide-react';
import { AppRoute } from '../types';

interface BottomNavigationProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  savedCount?: number;
  unreadMessagesCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentRoute,
  onNavigate,
  savedCount = 0,
  unreadMessagesCount = 2
}) => {
  if (currentRoute === '/chat') {
    return null;
  }
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe lg:hidden">
      <div className="max-w-md mx-auto px-3 py-1.5 flex items-center justify-between relative">
        {/* Home */}
        <button
          onClick={() => onNavigate('/')}
          className="flex flex-col items-center justify-center flex-1 py-1 group tap-bounce"
        >
          <div className="relative">
            <Home 
              className={`w-5 h-5 transition-colors ${
                currentRoute === '/' 
                  ? 'text-[#1464F4] stroke-[2.5]' 
                  : 'text-slate-500 group-hover:text-slate-800 stroke-[1.8]'
              }`} 
            />
          </div>
          <span 
            className={`text-[11px] mt-1 font-medium transition-colors ${
              currentRoute === '/' 
                ? 'text-[#1464F4] font-bold' 
                : 'text-slate-500 group-hover:text-slate-800'
            }`}
          >
            Home
          </span>
        </button>

        {/* Saved */}
        <button
          onClick={() => onNavigate('/saved')}
          className="flex flex-col items-center justify-center flex-1 py-1 group tap-bounce"
        >
          <div className="relative">
            <Heart 
              className={`w-5 h-5 transition-colors ${
                currentRoute === '/saved' 
                  ? 'text-[#1464F4] fill-[#1464F4] stroke-[2.5]' 
                  : 'text-slate-500 group-hover:text-slate-800 stroke-[1.8]'
              }`} 
            />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-[#1464F4] rounded-full ring-2 ring-white"></span>
            )}
          </div>
          <span 
            className={`text-[11px] mt-1 font-medium transition-colors ${
              currentRoute === '/saved' 
                ? 'text-[#1464F4] font-bold' 
                : 'text-slate-500 group-hover:text-slate-800'
            }`}
          >
            Saved
          </span>
        </button>

        {/* Post Button (Center Elevated Circular Action) */}
        <div className="flex flex-col items-center justify-center flex-1 -mt-5 relative z-10">
          <button
            onClick={() => onNavigate('/post')}
            className={`w-13 h-13 rounded-full flex items-center justify-center text-white shadow-[0_6px_20px_rgba(20,100,244,0.45)] ring-4 ring-white active:scale-95 transition-transform tap-bounce ${
              currentRoute.startsWith('/post') ? 'bg-[#0A47B8]' : 'bg-[#1464F4] hover:bg-[#1156D4]'
            }`}
            aria-label="Post an ad or listing"
          >
            <Plus className="w-7 h-7 stroke-[2.8]" />
          </button>
          <span 
            className={`text-[11px] mt-1 font-medium transition-colors ${
              currentRoute.startsWith('/post') 
                ? 'text-[#1464F4] font-bold' 
                : 'text-slate-500'
            }`}
          >
            Post
          </span>
        </div>

        {/* Messages */}
        <button
          onClick={() => onNavigate('/messages')}
          className="flex flex-col items-center justify-center flex-1 py-1 group tap-bounce"
        >
          <div className="relative">
            <MessageSquare 
              className={`w-5 h-5 transition-colors ${
                currentRoute === '/messages' 
                  ? 'text-[#1464F4] stroke-[2.5]' 
                  : 'text-slate-500 group-hover:text-slate-800 stroke-[1.8]'
              }`} 
            />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-3.5 h-3.5 px-1 bg-[#EA384D] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-1 ring-white">
                {unreadMessagesCount}
              </span>
            )}
          </div>
          <span 
            className={`text-[11px] mt-1 font-medium transition-colors ${
              currentRoute === '/messages' 
                ? 'text-[#1464F4] font-bold' 
                : 'text-slate-500 group-hover:text-slate-800'
            }`}
          >
            Messages
          </span>
        </button>

        {/* Profile */}
        <button
          onClick={() => onNavigate('/profile')}
          className="flex flex-col items-center justify-center flex-1 py-1 group tap-bounce"
        >
          <div className="relative">
            <User 
              className={`w-5 h-5 transition-colors ${
                currentRoute === '/profile' 
                  ? 'text-[#1464F4] stroke-[2.5]' 
                  : 'text-slate-500 group-hover:text-slate-800 stroke-[1.8]'
              }`} 
            />
          </div>
          <span 
            className={`text-[11px] mt-1 font-medium transition-colors ${
              currentRoute === '/profile' 
                ? 'text-[#1464F4] font-bold' 
                : 'text-slate-500 group-hover:text-slate-800'
            }`}
          >
            Profile
          </span>
        </button>
      </div>
    </nav>
  );
};
