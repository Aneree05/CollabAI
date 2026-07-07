const Button = ({ children, className = '', variant = 'primary', ...props }) => {
  const base = 'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors'
  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-700',
    secondary: 'bg-surface text-text border border-border hover:bg-slate-50',
    danger: 'bg-danger text-white hover:bg-red-700',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button
