import { Link, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../../contexts/useAuth'

const DashboardShell = () => {
  const { logout, user } = useAuth()
  const location = useLocation()
  const isAdmin = user?.roles?.includes('admin')

  const navItems = [
    { label: 'Marketplace', path: '/marketplace' },
    { label: 'Projects', path: '/projects' },
    { label: 'My Services', path: '/marketplace/my-services' },
    { label: 'Profile', path: '/profile' },
    { label: 'AI', path: '/ai' },
    ...(isAdmin ? [{ label: 'Admin', path: '/admin' }] : []),
  ]

  return (
    <div className="min-h-screen bg-background text-text">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-lg font-semibold">CollabAI</h1>
            <p className="text-sm text-secondary">{user?.name || 'Signed in'}</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={logout} className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-secondary">Logout</button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
        <aside className="w-full rounded-xl border border-border bg-surface p-4 lg:w-64">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path)
              return (
                <Link key={item.path} to={item.path} className={`block rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-primary text-white' : 'text-secondary hover:bg-background hover:text-text'}`}>
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 rounded-xl border border-border bg-surface p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardShell
