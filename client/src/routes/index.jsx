import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'
import DashboardShell from '../components/dashboard/DashboardShell'
import DashboardLayout from '../layouts/DashboardLayout'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import MarketplacePage from '../pages/marketplace/MarketplacePage'
import ServiceDetailPage from '../pages/marketplace/ServiceDetailPage'
import EditServicePage from '../pages/marketplace/EditServicePage'
import MyServicesPage from '../pages/marketplace/MyServicesPage'
import ProjectsPage from '../pages/projects/ProjectsPage'
import ProjectDetailPage from '../pages/projects/ProjectDetailPage'
import WorkspacePage from '../pages/workspace/WorkspacePage'
import ProfilePage from '../pages/profile/ProfilePage'
import AiPage from '../pages/ai/AiPage'
import AdminPage from '../pages/admin/AdminPage'

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
            element: <LandingPage />,
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
  {
    path: '/',
    element: <ProtectedRoute requireAuth />,
    children: [
      {
        path: '',
        element: <DashboardShell />,
        children: [
          {
            path: 'marketplace',
            element: <MarketplacePage />,
          },
          {
            path: 'marketplace/:id',
            element: <ServiceDetailPage />,
          },
          {
            path: 'marketplace/create',
            element: <MarketplacePage />,
          },
          {
            path: 'marketplace/edit/:id',
            element: <EditServicePage />,
          },
          {
            path: 'marketplace/my-services',
            element: <MyServicesPage />,
          },
          {
            path: 'projects',
            element: <ProjectsPage />,
          },
          {
            path: 'projects/:id',
            element: <ProjectDetailPage />,
          },
          {
            path: 'workspace/:projectId',
            element: <WorkspacePage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
            path: 'ai',
            element: <AiPage />,
          },
          {
            path: 'admin',
            element: <AdminPage />,
          },
        ],
      },
    ],
  },
])

export default router
