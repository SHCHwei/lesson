import { useEffect, useState } from 'react'

import AppRoutes from './routes/AppRoutes'
import { clearAuthUser, getAuthUser } from './lib/authStorage'
import './App.css'

function App() {
  const storedUser = getAuthUser()
  const [loggedIn, setLoggedIn] = useState(!!storedUser)
  const [userRole, setUserRole] = useState(storedUser?.type || 'teacher')
  const [currentUser, setCurrentUser] = useState(storedUser)


  // The backend has no session-verify endpoint, so we can't confirm on load that the
  // httpOnly cookie is still valid. Instead we trust the locally cached login state
  // optimistically and rely on this listener to fall back to "logged out" the moment
  // any API call comes back 401 (see the `auth:unauthorized` dispatch in lib/api.js).
  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuthUser()
      setLoggedIn(false)
      setCurrentUser(null)
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [])

  return (
    <AppRoutes
      loggedIn={loggedIn}
      setLoggedIn={setLoggedIn}
      userRole={userRole}
      setUserRole={setUserRole}
      currentUser={currentUser}
      setCurrentUser={setCurrentUser}
    />
  )
}

export default App
