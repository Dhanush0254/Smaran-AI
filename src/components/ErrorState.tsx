interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  const isUnauthorized = message.toLowerCase().includes('unauthorized') || message.includes('401');

  return (
    <div className="bg-red-50 rounded-xl p-6 border border-red-100 text-center">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
        {isUnauthorized ? (
          <span className="text-2xl">🔒</span>
        ) : (
          <span className="text-2xl">⚠️</span>
        )}
      </div>
      <h4 className="text-base font-bold text-red-900 mb-1">
        {isUnauthorized ? 'Authentication Required' : 'Unable to load data'}
      </h4>
      <p className="text-sm text-red-700 mb-5">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
