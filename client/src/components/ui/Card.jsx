const Card = ({ children, className = '', ...props }) => (
  <div className={`rounded-xl border border-border bg-surface p-4 shadow-sm ${className}`} {...props}>
    {children}
  </div>
)

export default Card
