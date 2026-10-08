import { Navigate } from 'react-router-dom'
import { Loader } from 'lucide-react'
import useAuthStore from '../../store/authStore'

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, _hasHydrated } = useAuthStore()

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-primary-600" size={32} />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin()) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
