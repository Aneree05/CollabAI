const ErrorState = ({ title = 'Something went wrong', description = 'Please try again later.' }) => (
  <div className="rounded-xl border border-danger/20 bg-danger/5 p-6 text-center">
    <h3 className="text-base font-semibold text-text">{title}</h3>
    <p className="mt-2 text-sm text-secondary">{description}</p>
  </div>
)

export default ErrorState
