import { Box, Container, Paper, Typography, TextField, Button, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import SidebarMenu from '@components/common/SidebarMenu'
import Topbar from '@components/common/Topbar'

import { teacherApi, studentApi, authApi } from '@lib/api'
import { clearAuthUser } from '@lib/authStorage'

export default function SecurityPage({
  userRole, 
  currentUser, 
  setLoggedIn, 
  setCurrentUser 
}) {
  const navigate = useNavigate()
  const isTeacher = userRole === 'teacher'
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // 清除該欄位的錯誤訊息
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    setSuccessMessage('')
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.currentPassword) {
      newErrors.currentPassword = '請輸入原始密碼'
    }

    if (!formData.newPassword) {
      newErrors.newPassword = '請輸入新密碼'
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = '新密碼長度至少需要 6 個字元'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '請確認新密碼'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = '新密碼與確認密碼不符'
    }

    if (formData.currentPassword && formData.newPassword && 
        formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = '新密碼不能與原始密碼相同'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      
      try {

        if (isTeacher) {
          await teacherApi.updatePassword({
            teacherID: currentUser.id,
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
          })
        } else {
          await studentApi.updatePassword({
            studentID: currentUser.id,
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
          })
        }

        console.log('密碼重設資料:', {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
        
        // 顯示成功訊息
        setSuccessMessage('密碼已成功更新')
        
        // 清空表單
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })

        handleLogout()  // 登出使用者，讓他重新登入
      } catch (error) {
        console.error('密碼重設失敗:', error)
      }
    }
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

          <Paper elevation={0} sx={{ p: 3, backgroundColor: 'white' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              重設密碼
            </Typography>
            
            {successMessage && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {successMessage}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                type="password"
                label="原始密碼"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                error={!!errors.currentPassword}
                helperText={errors.currentPassword}
                sx={{ mb: 3 }}
                autoComplete="current-password"
              />

              <TextField
                fullWidth
                type="password"
                label="新密碼"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                error={!!errors.newPassword}
                helperText={errors.newPassword}
                sx={{ mb: 3 }}
                autoComplete="new-password"
              />

              <TextField
                fullWidth
                type="password"
                label="確認新密碼"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                sx={{ mb: 3 }}
                autoComplete="new-password"
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  mt: 2,
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#1565c0'
                  }
                }}
              >
                更新密碼
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  )
}
