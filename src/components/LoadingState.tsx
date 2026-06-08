export default function LoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="shimmer h-5 w-1/3 rounded-md" />
            <div className="shimmer h-5 w-12 rounded-full" />
          </div>
          <div className="space-y-2.5">
            <div className="shimmer h-4 w-full rounded-md" />
            <div className="shimmer h-4 w-5/6 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
