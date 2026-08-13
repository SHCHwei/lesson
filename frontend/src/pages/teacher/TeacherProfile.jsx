import { useEffect, useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
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
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import { useNavigate } from 'react-router-dom'
import { teacherApi } from '@lib/api'
import { saveAuthUser } from '@lib/authStorage'

const emptyProfile = { name: '', email: '', phone: '', major: '', bio: '' }

export default function TeacherProfile({ currentUser, setCurrentUser }) {
  const navigate = useNavigate()

  // Holds the raw record from GET /api/v1/teachers/:id (including the password
  // hash). The backend's PUT handler does a full-row overwrite (gorm Save), so any
  // field left out of the request body gets wiped to its zero value — including the
  // password. We keep this record around purely to spread it back into the PUT
  // payload untouched, so editing a profile can never blank out the login password.
  const [originalTeacher, setOriginalTeacher] = useState(null)
  const [profile, setProfile] = useState(emptyProfile)

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const teacherId = currentUser?.id

  useEffect(() => {
    if (!teacherId) {
      setLoadError('找不到登入的教師帳號，請重新登入')
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setLoadError('')

    teacherApi
      .getById(teacherId)
      .then((data) => {
        if (cancelled) return
        setOriginalTeacher(data)
        setProfile({
          name: data.teacherName || '',
          email: data.email || '',
          phone: data.phone || '',
          major: data.major || '',
          bio: data.profile || '',
        })
      })
      .catch((error) => {
        if (cancelled) return
        setLoadError(error.message || '無法載入教師資料')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [teacherId])

  const handleChange = (field) => (event) => {
    setProfile({ ...profile, [field]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!teacherId || !originalTeacher) return

    setSaving(true)
    setSaveError('')

    try {
      const payload = {
        ...originalTeacher,
        teacherName: profile.name,
        email: profile.email,
        phone: profile.phone,
        major: profile.major,
        profile: profile.bio,
      }
      const updated = await teacherApi.update(teacherId, payload)
      setOriginalTeacher(updated)

      const updatedUser = { ...currentUser, name: updated.teacherName, email: updated.email }
      saveAuthUser(updatedUser)
      setCurrentUser?.(updatedUser)

      setSnackbarOpen(true)
    } catch (error) {
      setSaveError(error.message || '更新失敗，請稍後再試')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box className="teacher-profile-page" sx={{ py: 4, px: 2, minHeight: '100vh', background: '#f5f7fb' }}>
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
                教師個人資料設定
              </Typography>
              <Chip label="教師權限" color="primary" size="small" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              獨立頁面網址：/teacher_profile
            </Typography>
          </Box>
        </Stack>

        {loadError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {loadError}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          originalTeacher && (
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
                    bgcolor: '#1e3a8a',
                    fontSize: '2rem',
                    boxShadow: '0 4px 14px rgba(30, 58, 138, 0.25)',
                  }}
                >
                  <SchoolRoundedIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {profile.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {profile.major || '尚未設定授課領域'}
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

              {saveError && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSaveError('')}>
                  {saveError}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight={700} color="primary" sx={{ mb: 1 }}>
                      基本個人資訊
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="教師姓名"
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="主要研究與授課領域"
                      value={profile.major}
                      onChange={handleChange('major')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeRoundedIcon color="action" fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="個人與學術簡介"
                      value={profile.bio}
                      onChange={handleChange('bio')}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate('/home')}
                        sx={{ borderRadius: '12px', px: 4 }}
                        disabled={saving}
                      >
                        取消
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveRoundedIcon />}
                        color="primary"
                        sx={{ borderRadius: '12px', px: 4 }}
                        disabled={saving}
                      >
                        {saving ? '儲存中...' : '儲存教師資料'}
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          )
        )}
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)} sx={{ width: '100%', borderRadius: '10px' }}>
          教師個人資料已成功更新！
        </Alert>
      </Snackbar>
    </Box>
  )
}
