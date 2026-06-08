import type { User } from '@supabase/supabase-js';
import Header from './Header';
import UserProfileCard from './UserProfileCard';
import DataCard from './DataCard';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import { useSampleData } from '../hooks/useSampleData';

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const { data, loading, error, refetch } = useSampleData(true);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header user={user} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h2>
          <p className="text-slate-500 mt-1">Manage your account and view sample data.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <UserProfileCard user={user} />

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-semibold text-slate-900">System Status</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Total Records</span>
                  <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">{data.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">API Health</span>
                  <span className={`text-sm font-bold flex items-center gap-1.5 ${error ? 'text-red-600' : 'text-emerald-600'}`}>
                    <span className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    {error ? 'Failing' : 'Operational'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Database Records</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Fetched from Supabase Edge Function</p>
                </div>
                <button
                  onClick={refetch}
                  disabled={loading}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:ring-2 focus:ring-slate-200 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>

              <div>
                {loading ? (
                  <LoadingState />
                ) : error ? (
                  <ErrorState message={error} onRetry={refetch} />
                ) : data.length === 0 ? (
                  <div className="text-center py-12 px-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    <p className="text-base font-medium text-slate-900 mb-1">No records found</p>
                    <p className="text-sm text-slate-500">Run the SQL script in Supabase to populate the table.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.map((record) => (
                      <DataCard key={record.id} record={record} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
