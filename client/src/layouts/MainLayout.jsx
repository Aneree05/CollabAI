import { Outlet } from 'react-router-dom'

const MainLayout = () => (
  <div className="min-h-screen bg-background text-text">
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Outlet />
    </main>
  </div>
)

export default MainLayout
