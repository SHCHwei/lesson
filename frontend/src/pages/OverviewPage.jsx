import { useState } from 'react'
import { Box, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import SidebarMenu from '@components/common/SidebarMenu'
import Topbar from '@components/common/Topbar'
import { authApi } from '@lib/api'
import { clearAuthUser } from '@lib/authStorage'

export default function OverviewPage({ 
  userRole, 
  currentUser,
  setLoggedIn, 
  setCurrentUser 
}) {
  const navigate = useNavigate()
  const isTeacher = userRole === 'teacher'

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout request failed:', error)
    }
    clearAuthUser()
    setCurrentUser(null)
    setLoggedIn(false)
    navigate('/login/teacher')
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <SidebarMenu isTeacher={isTeacher} onLogout={handleLogout} />
      
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar 
          isTeacher={isTeacher}
          setLoggedIn={setLoggedIn} 
          setCurrentUser={setCurrentUser} 
        />
        
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>

        </Container>
      </Box>
    </Box>
  )
}
