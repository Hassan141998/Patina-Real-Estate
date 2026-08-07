import { createContext, useContext, useEffect, useState } from 'react'
import { apiFetch, TOKEN_KEY } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [agent, setAgent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    apiFetch('/auth/me')
      .then(setAgent)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  async function login(username, password) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    localStorage.setItem(TOKEN_KEY, data.access_token)
    setToken(data.access_token)
    setAgent(data.agent)
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setAgent(null)
  }

  return (
    <AuthContext.Provider value={{ token, agent, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
