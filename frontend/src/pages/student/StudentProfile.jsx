import { useState, useEffect } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'

import { studentApi } from '@lib/api'
import { saveAuthUser } from '@lib/authStorage'
import { useNavigate } from 'react-router-dom'

export default function StudentProfile({ currentUser, setCurrentUser }) {
  const navigate = useNavigate()
  const [originalStudent, setOriginalStudent] = useState(null)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
  })

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const handleChange = (field) => (e) => {
    setProfile({ ...profile, [field]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!studentID) return
    
    try {
      const payload = {
        ...originalStudent,
        studentName: profile.name,
        email: profile.email,
        phone: profile.phone,
      }
      const updated = await studentApi.update(studentID, payload)
      setOriginalStudent(updated)

      const updatedUser = { ...currentUser, name: updated.studentName, email: updated.email }

      saveAuthUser(updatedUser)
      setCurrentUser(updatedUser)
      setSnackbarOpen(true)
    } catch (error) {
      setSaveError(error.message || '更新失敗，請稍後再試')
    } finally {
      setSaving(false)
    }
  }

  const studentID = currentUser?.id

  useEffect(() => {
    if (!currentUser) {
      setLoadError('找不到登入的學生帳號，請重新登入')
      setLoading(false)
      return
    }
    if (!studentID) {
      setLoadError('找不到登入的學生帳號，請重新登入')
      setLoading(false)
      return
    }
    
    let cancelled = false
    setLoading(true)
    setLoadError('')

    studentApi
      .getById(studentID)
      .then((data) => {
        if (cancelled) return
        setOriginalStudent(data)
        setProfile({
          name: data.studentName || '',
          email: data.email || '',
          phone: data.phone || '',
        })
      })
      .catch((error) => {
        if (cancelled) return
        setLoadError(error.message || '無法載入學生資料')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [studentID])



  return (
    <Box className="student-profile-page" sx={{ py: 4, px: 2, minHeight: '100vh', background: '#f5f7fb' }}>
      <Container maxWidth="md">
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate('/home')}
            variant="outlined"
            sx={{ borderRadius: '10px', backgroundColor: '#fff' }}
          >
            返回主頁
          </Button>
          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Typography variant="h5" fontWeight={700}>
                學生個人資料設定
              </Typography>
              <Chip label="學生身份" color="success" size="small" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              獨立頁面網址：/student_profile
            </Typography>
          </Box>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '24px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            background: '#ffffff',
            mb: 4,
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#0d9488',
                fontSize: '2rem',
                boxShadow: '0 4px 14px rgba(13, 148, 136, 0.25)',
              }}
            >
              <MenuBookRoundedIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {profile.name}
              </Typography>

              <Chip
                icon={<EmailRoundedIcon fontSize="small" />}
                label={profile.email}
                size="small"
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </Box>
          </Stack>

          <Divider sx={{ mb: 4 }} />

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={700} color="success.main" sx={{ mb: 1 }}>
                  基本個人資訊
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="學生姓名"
                  value={profile.name}
                  onChange={handleChange('name')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonRoundedIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="電子郵件 Email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange('email')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailRoundedIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="聯絡電話"
                  value={profile.phone}
                  onChange={handleChange('phone')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneRoundedIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/home')}
                    sx={{ borderRadius: '12px', px: 4 }}
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<SaveRoundedIcon />}
                    color="success"
                    sx={{ borderRadius: '12px', px: 4 }}
                  >
                    儲存學生資料
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)} sx={{ width: '100%', borderRadius: '10px' }}>
          學生個人資料已成功更新！
        </Alert>
      </Snackbar>
    </Box>
  )
}
