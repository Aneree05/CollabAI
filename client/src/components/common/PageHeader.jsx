import { Link } from 'react-router-dom'

const PageHeader = ({ title, description, actions = null, backTo = null }) => (
  <div className="mb-6 flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
    <div>
      {backTo && (
        <Link to={backTo} className="mb-2 inline-block text-sm font-medium text-primary">
          ← Back
        </Link>
      )}
      <h1 className="text-2xl font-semibold text-text">{title}</h1>
      {description && <p className="mt-1 text-sm text-secondary">{description}</p>}
    </div>
    {actions}
  </div>
)

export default PageHeader
