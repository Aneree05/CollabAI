import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const ProtectedRoute = ({
  redirectPath = '/auth/login',
  requireAuth = true,
  allowedRoles = [],
}) => {
  const { user, token, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return null
  }

  if (requireAuth && !token) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />
  }

  if (!requireAuth && token) {
    return <Navigate to='/' replace />
  }

  if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to='/' replace />
  }

  return <Outlet />
}

export default ProtectedRoute
