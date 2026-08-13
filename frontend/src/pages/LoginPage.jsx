import { useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import { Navigate, useNavigate } from 'react-router-dom'
import { authApi } from '@lib/api'
import { saveAuthUser } from '@lib/authStorage'

export default function LoginPage({ role, loggedIn, setLoggedIn, setUserRole, setCurrentUser }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const isTeacher = role === 'teacher'
  const targetApi = isTeacher ? '/api/v1/teacher/login' : '/api/v1/student/login'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setLoading(true)

    try {
      // Teacher login responds with { loginData: {...} }; student login currently
      // responds with { token: {...} } (the backend nests the whole user object
      // under the "token" key instead of "loginData" for students) — accept both
      // shapes here rather than relying on the inconsistency.
      const response = isTeacher
        ? await authApi.teacherLogin({ email, password })
        : await authApi.studentLogin({ email, password })
      const userData = response?.loginData || response?.token

      // The `token` field returned by the backend is the same value as the httpOnly
      // session cookie the browser already stores automatically — we intentionally
      // drop it here rather than persisting it in browser storage (see lib/authStorage.js).
      const { id, name, email: userEmail, type } = userData || {}
      const user = { id, name, email: userEmail, type: type || role }

      saveAuthUser(user)
      setCurrentUser(user)
      setLoggedIn(true)
      setUserRole(user.type)
      navigate('/home')
    } catch (error) {
      console.error(`${role} login failed:`, error)
      setErrorMessage(error.message || '登入失敗，請確認帳號與密碼')
    } finally {
      setLoading(false)
    }
  }

  if (loggedIn) return <Navigate to="/home" replace />

  return (
    <Box className="login-page">
      <Box className="login-card-wrap">
        <Paper className="login-panel" elevation={0}>
          <Box className={`login-brand ${isTeacher ? 'teacher-theme' : 'student-theme'}`}>
            <Avatar className="brand-avatar">
              {isTeacher ? <SchoolRoundedIcon fontSize="large" /> : <MenuBookRoundedIcon fontSize="large" />}
            </Avatar>
            <Typography variant="h4" fontWeight={700}>
              {isTeacher ? '教師管理平台' : '學生學習平台'}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {isTeacher
                ? '專為教師設計的教學與學生管理系統，隨時掌握授課與班級狀況。'
                : '學生專屬的課程與學習中心，方便隨時檢視學習資源與成績。'}
            </Typography>
            <Box className="api-badge" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', mt: 1 }}>
              Target API: {targetApi}
            </Box>
          </Box>

          <Box className="login-form-box">
            <Stack spacing={2} component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Box className="role-switcher">
                <Button
                  className="role-tab-btn"
                  variant={isTeacher ? 'contained' : 'text'}
                  color="primary"
                  startIcon={<SchoolRoundedIcon />}
                  onClick={() => navigate('/login/teacher')}
                  disableElevation
                >
                  教師登入
                </Button>
                <Button
                  className="role-tab-btn"
                  variant={!isTeacher ? 'contained' : 'text'}
                  color="success"
                  startIcon={<MenuBookRoundedIcon />}
                  onClick={() => navigate('/login/student')}
                  disableElevation
                >
                  學生登入
                </Button>
              </Box>

              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {isTeacher ? '教師登入' : '學生登入'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isTeacher ? '請輸入您的教師帳號與密碼' : '請輸入您的學生帳號/學號與密碼'}
                </Typography>
              </Box>

              {errorMessage && (
                <Alert severity="error" onClose={() => setErrorMessage('')}>
                  {errorMessage}
                </Alert>
              )}

              <TextField
                fullWidth
                label={isTeacher ? '教師 Email' : '學生 Email'}
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="密碼"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                color={isTeacher ? 'primary' : 'success'}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : isTeacher ? (
                  '登入教師帳號'
                ) : (
                  '登入學生帳號'
                )}
              </Button>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">還沒有帳號？</Typography>
                <Button
                  variant="text"
                  color={isTeacher ? 'primary' : 'success'}
                  startIcon={<PersonOutlineRoundedIcon />}
                  onClick={() => navigate(isTeacher ? '/register/teacher' : '/register/student')}
                >
                  註冊帳號
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}
