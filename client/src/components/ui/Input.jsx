const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary ${className}`}
    {...props}
  />
)

export default Input
