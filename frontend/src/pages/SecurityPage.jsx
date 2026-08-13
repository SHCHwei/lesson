import { Box, Container, Paper, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import SidebarMenu from '@components/common/SidebarMenu'
import Topbar from '@components/common/Topbar'

import { authApi } from '@lib/api'
import { clearAuthUser } from '@lib/authStorage'

export default function SecurityPage({ 
  userRole, 
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
          <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              系統安全
            </Typography>
            <Typography variant="body2" color="text.secondary">
              管理帳號安全性設定
            </Typography>
          </Paper>

          {/* <SecurityTab /> */}
        </Container>
      </Box>
    </Box>
  )
}
