import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

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
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <ProtectedRoute requireAuth={false} />,
        children: [
          {
            path: '',
            element: <LoginPage />,
          },
        ],
      },
      {
        path: 'register',
        element: <ProtectedRoute requireAuth={false} />,
        children: [
          {
            path: '',
            element: <RegisterPage />,
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
