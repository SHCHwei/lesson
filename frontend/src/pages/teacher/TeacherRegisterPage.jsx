import { useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import WorkRoundedIcon from '@mui/icons-material/WorkRounded'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@lib/api'

export default function TeacherRegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    teacherName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (form.password !== form.confirmPassword) {
      setErrorMessage('兩次輸入的密碼不一致')
      return
    }

    if (form.password.length < 6) {
      setErrorMessage('密碼長度至少需為 6 個字元')
      return
    }

    setLoading(true)

    try {
      await authApi.teacherRegister({
        teacherName: form.teacherName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      })

      setSnackbarOpen(true)
      setTimeout(() => {
        navigate('/login/teacher')
      }, 1500)
    } catch (error) {
      console.error('Teacher registration failed:', error)
      setErrorMessage(error.message || '註冊失敗，請檢查資料後重試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box className="login-page" sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', py: 4 }}>
      <Box className="login-card-wrap" sx={{ width: 'min(100%, 960px)' }}>
        <Paper className="login-panel" elevation={0}>
          <Box className="login-brand teacher-theme">
            <Avatar className="brand-avatar">
              <SchoolRoundedIcon fontSize="large" />
            </Avatar>
            <Typography variant="h4" fontWeight={700}>
              教師帳號註冊
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              加入教學管理平台，輕鬆進行課程規劃、學生評分與課堂管理。
            </Typography>
            <Box className="api-badge" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', mt: 1 }}>
              Target API: /api/v1/teachers/
            </Box>
          </Box>

          <Box className="login-form-box" sx={{ p: 4 }}>
            <Stack spacing={2.5} component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Box className="role-switcher">
                <Button
                  className="role-tab-btn"
                  variant="contained"
                  color="primary"
                  startIcon={<SchoolRoundedIcon />}
                  disableElevation
                >
                  教師註冊
                </Button>
                <Button
                  className="role-tab-btn"
                  variant="text"
                  color="success"
                  startIcon={<MenuBookRoundedIcon />}
                  onClick={() => navigate('/register/student')}
                  disableElevation
                >
                  學生註冊
                </Button>
              </Box>

              <Box>
                <Typography variant="h5" fontWeight={700}>
                  建立教師帳號
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  請填寫您的教師基本資料與密碼
                </Typography>
              </Box>

              {errorMessage && (
                <Alert severity="error" onClose={() => setErrorMessage('')}>
                  {errorMessage}
                </Alert>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="教師姓名"
                    placeholder="請輸入姓名"
                    value={form.teacherName}
                    onChange={handleChange('teacherName')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineRoundedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="電子郵件 Email"
                    type="email"
                    placeholder="example@university.edu.tw"
                    value={form.email}
                    onChange={handleChange('email')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailRoundedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="聯絡電話"
                    placeholder="0912-345-678"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneRoundedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="設定密碼"
                    type="password"
                    value={form.password}
                    onChange={handleChange('password')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="確認密碼"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                color="primary"
                sx={{ borderRadius: '12px', py: 1.2 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : '註冊教師帳號'}
              </Button>

              <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  已有教師帳號？
                </Typography>
                <Button variant="text" onClick={() => navigate('/login/teacher')}>
                  返回教師登入
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)} sx={{ width: '100%', borderRadius: '10px' }}>
          教師帳號註冊成功！即將轉向登入頁面...
        </Alert>
      </Snackbar>
    </Box>
  )
}
