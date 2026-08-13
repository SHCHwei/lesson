import { useState } from 'react'
import { Box, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import SidebarMenu from '../components/common/SidebarMenu'
import Topbar from '../components/common/Topbar'
import CoursesTab from '../components/dashboard/tabs/CoursesTab'
import OverviewTab from '../components/dashboard/tabs/OverviewTab'

import { authApi } from '../lib/api'
import { clearAuthUser } from '../lib/authStorage'

export default function DashboardPage({ userRole, setLoggedIn, setCurrentUser }) {
  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = useState('courses')
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)


  const isTeacher = userRole === 'teacher'


  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      // Even if the backend call fails, still clear local state so the UI
      // doesn't strand the user in a "logged in" screen with a dead session.
      console.error('Logout request failed:', error)
    }
    clearAuthUser()
    setCurrentUser(null)
    setLoggedIn(false)
    navigate('/login/teacher')
  }

  return (
    <Box className="dashboard-shell">
      <SidebarMenu
        isTeacher={isTeacher}
        onLogout={handleLogout}
      />

      <Box className="main-panel">
        <Topbar
          isTeacher={isTeacher}
          setLoggedIn={setLoggedIn}
          setCurrentUser={setCurrentUser}
        />

      </Box>
    </Box>
  )
}
