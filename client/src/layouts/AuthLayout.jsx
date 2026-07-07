import { Outlet } from 'react-router-dom'

const AuthLayout = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
    <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-text">CollabAI</h1>
        <p className="mt-1 text-sm text-secondary">Authentication</p>
      </div>
      <Outlet />
    </div>
  </div>
)

export default AuthLayout
