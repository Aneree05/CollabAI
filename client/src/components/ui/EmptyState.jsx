const EmptyState = ({ title, description }) => (
  <div className="rounded-xl border border-dashed border-border bg-background p-8 text-center">
    <h3 className="text-base font-semibold text-text">{title}</h3>
    <p className="mt-2 text-sm text-secondary">{description}</p>
  </div>
)

export default EmptyState
