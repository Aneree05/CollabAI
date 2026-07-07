import { Outlet } from 'react-router-dom'

const DashboardLayout = () => (
  <div className="min-h-screen bg-background text-text">
    <header className="border-b border-border bg-surface px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">CollabAI</h1>
          <p className="text-sm text-secondary">Dashboard</p>
        </div>
      </div>
    </header>

    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <aside className="hidden w-64 rounded-xl border border-border bg-surface p-4 lg:block">
        <p className="text-sm font-medium text-secondary">Sidebar placeholder</p>
      </aside>

      <main className="flex-1 rounded-xl border border-border bg-surface p-4">
        <Outlet />
      </main>
    </div>
  </div>
)

export default DashboardLayout
