import type { SampleDataRecord } from '../services/supabaseService';

interface DataCardProps {
  record: SampleDataRecord;
}

export default function DataCard({ record }: DataCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between gap-4 mb-2">
        <h4 className="font-semibold text-slate-900 leading-tight">
          {record.title}
        </h4>
        <span className="shrink-0 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
          #{record.id}
        </span>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">
        {record.description}
      </p>
    </div>
  );
}
