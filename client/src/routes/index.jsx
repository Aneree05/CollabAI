import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import MainLayout from '../layouts/MainLayout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <ProtectedRoute requireAuth={false} />, 
        children: [
          {
            path: '',
            element: <div className="rounded-xl border border-border bg-surface p-6">Home placeholder</div>,
          },
        ],
      },
      {
        path: 'auth',
        element: <ProtectedRoute requireAuth={false} />, 
        children: [
          {
            path: 'login',
            element: <div className="rounded-xl border border-border bg-surface p-6">Auth placeholder</div>,
          },
        ],
      },
    ],
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute requireAuth />,
    children: [
      {
        path: '',
        element: <DashboardLayout />,
        children: [
          {
            path: '',
            element: <div className="rounded-xl border border-border bg-surface p-6">Dashboard placeholder</div>,
          },
        ],
      },
    ],
  },
])

export default router
