import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth()

  if (loading) {
    return (
      <p className="label" style={{ padding: '64px 0' }}>
        Checking session…
      </p>
    )
  }
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}
