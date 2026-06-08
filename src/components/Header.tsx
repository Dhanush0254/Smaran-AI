import type { User } from '@supabase/supabase-js';
import { signOut } from '../services/supabaseService';

interface HeaderProps {
  user: User;
}

export default function Header({ user }: HeaderProps) {
  const userName = user.user_metadata?.full_name || user.email || 'User';
  const avatarUrl = user.user_metadata?.avatar_url;

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-slate-900 tracking-tight">SmaranAI</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {avatarUrl ? (
              <img src={avatarUrl} alt={userName} className="h-8 w-8 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold border border-indigo-200">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm font-medium text-slate-700 hidden sm:inline-block">{userName}</span>
          </div>

          <div className="h-5 w-px bg-slate-300 hidden sm:block"></div>

          <button
            onClick={handleLogout}
            className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
