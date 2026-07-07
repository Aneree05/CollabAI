import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../../contexts/useAuth'

const ProtectedRoute = ({
  redirectPath = '/login',
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
    return <Navigate to={location.state?.from?.pathname || '/marketplace'} replace />
  }

  if (allowedRoles.length > 0) {
    const roles = Array.isArray(user?.roles) ? user.roles : []
    const hasAccess = roles.some((role) => allowedRoles.includes(role))

    if (!hasAccess) {
      return <Navigate to='/' replace />
    }
  }

  return <Outlet />
}

export default ProtectedRoute
