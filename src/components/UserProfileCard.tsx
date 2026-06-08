import type { User } from '@supabase/supabase-js';

interface UserProfileCardProps {
  user: User;
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  const userName = user.user_metadata?.full_name || user.email || 'User';
  const userEmail = user.email || '';
  const provider = user.app_metadata?.provider || 'email';
  const lastSignIn = user.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleString()
    : 'N/A';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-semibold text-slate-900">Profile Details</h3>
        <p className="text-sm text-slate-500 mt-0.5">Account information</p>
      </div>
      <div className="p-5 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Name</p>
          <p className="text-sm font-medium text-slate-900">{userName}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Email</p>
          <p className="text-sm font-medium text-slate-900">{userEmail}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Provider</p>
          <p className="text-sm font-medium text-slate-900 capitalize flex items-center gap-2">
            {provider}
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Last Login</p>
          <p className="text-sm font-medium text-slate-900">{lastSignIn}</p>
        </div>
      </div>
    </div>
  );
}
