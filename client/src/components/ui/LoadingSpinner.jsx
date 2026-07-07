const LoadingSpinner = ({ label = 'Loading...' }) => (
  <div className="flex items-center justify-center gap-2 py-6 text-sm text-secondary">
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    <span>{label}</span>
  </div>
)

export default LoadingSpinner
