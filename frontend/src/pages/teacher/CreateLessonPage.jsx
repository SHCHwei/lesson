import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  InputAdornment,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import { useNavigate } from 'react-router-dom'
import { lessonApi } from '@lib/api'

export default function CreateLessonPage({ currentUser }) {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    lessonName: '',
    lessonDescribe: '',
    tuitionFee: '',
    lessonTime: '',
    lessonAddress: '',
    signupStartDate: '',
    signupEndDate: '',
    status: '1',
    email: currentUser?.email || '',
  })

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const handleChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const validateDates = () => {
    const today = getTodayDate()
    
    if (form.signupStartDate && form.signupStartDate < today) {
      setErrorMessage('報名開始日期不能是過去的日期')
      return false
    }
    
    if (form.signupEndDate && form.signupEndDate < today) {
      setErrorMessage('報名結束日期不能是過去的日期')
      return false
    }
    
    if (form.signupStartDate && form.signupEndDate && form.signupStartDate > form.signupEndDate) {
      setErrorMessage('報名開始日期不能晚於結束日期')
      return false
    }
    
    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    const requiredFields = [
      ['lessonName', '課程名稱'],
      ['lessonDescribe', '課程說明'],
      ['tuitionFee', '課程費用'],
      ['lessonTime', '課程時間'],
      ['lessonAddress', '課程地點'],
      ['signupStartDate', '報名開始日期'],
      ['signupEndDate', '報名結束日期'],
      ['email', '聯絡信箱'],
    ]
    const missingField = requiredFields.find(([field]) => !form[field].trim())
    if (missingField) {
      setErrorMessage(`請填寫${missingField[1]}`)
      return
    }

    if (!validateDates()) {
      return
    }

    if (!currentUser?.id) {
      setErrorMessage('找不到登入的教師帳號，請重新登入')
      return
    }

    setLoading(true)
    try {
      const signupDates = `${form.signupStartDate} ~ ${form.signupEndDate}`
      
      await lessonApi.create({
        lessonName: form.lessonName,
        lessonDescribe: form.lessonDescribe,
        tuitionFee: form.tuitionFee,
        lessonTime: form.lessonTime,
        lessonAddress: form.lessonAddress,
        signupDates: signupDates,
        status: form.status,
        email: form.email,
        teacherID: String(currentUser.id),
      })
      setSnackbarOpen(true)
      setTimeout(() => {
        navigate('/courses')
      }, 1500)
    } catch (error) {
      console.error('Failed to create lesson:', error)
      setErrorMessage(error.message || '建立課程失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box className="create-lesson-page" sx={{ py: 4, px: 2, minHeight: '100vh', background: '#f5f7fb' }}>
      <Container maxWidth="md">
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate(-1)}
            variant="outlined"
            sx={{ borderRadius: '10px', backgroundColor: '#fff' }}
          >
            返回
          </Button>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              建立新課程
            </Typography>
            <Typography variant="body2" color="text.secondary">
              請填寫下方欄位資訊以發布新課程
            </Typography>
          </Box>
        </Stack>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setErrorMessage('')}>
            {errorMessage}
          </Alert>
        )}

        <Card
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '24px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            background: '#ffffff',
          }}
        >
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid 
                container 
                spacing={3}
                direction="column"
                justifyContent="center"
                alignItems="flex-start"
              >
                {/* 1. 課程名稱 */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="課程名稱"
                    placeholder="請輸入課程名稱（如：Web 全端程式開發）"
                    value={form.lessonName}
                    onChange={handleChange('lessonName')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MenuBookRoundedIcon color="primary" fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* 7. 課程狀態 */}
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="課程狀態"
                    value={form.status}
                    onChange={handleChange('status')}
                  >
                    <MenuItem value="1">籌備中</MenuItem>
                    <MenuItem value="2">報名中</MenuItem>
                    <MenuItem value="3">開課中</MenuItem>
                    <MenuItem value="4">已完結</MenuItem>
                  </TextField>
                </Grid>

                {/* 3. 課程費用 */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="課程費用"
                    placeholder="如：3,500 或 免費"
                    value={form.tuitionFee}
                    onChange={handleChange('tuitionFee')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyRoundedIcon color="primary" fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* 4. 課程時間 */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="課程時間"
                    placeholder="如：週二 09:00 - 12:00"
                    value={form.lessonTime}
                    onChange={handleChange('lessonTime')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthRoundedIcon color="primary" fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* 5. 課程地點 */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="課程地點"
                    placeholder="如：資訊大樓 301 教室 / 線上 Meet"
                    value={form.lessonAddress}
                    onChange={handleChange('lessonAddress')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnRoundedIcon color="primary" fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* 6. 報名開始日期 */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    type="date"
                    label="報名開始日期"
                    value={form.signupStartDate}
                    onChange={handleChange('signupStartDate')}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: getTodayDate() }}
                  />
                </Grid>

                {/* 7. 報名結束日期 */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    type="date"
                    label="報名結束日期"
                    value={form.signupEndDate}
                    onChange={handleChange('signupEndDate')}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: form.signupStartDate || getTodayDate() }}
                  />
                </Grid>

                {/* 8. 聯絡信箱 */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    type="email"
                    label="聯絡信箱"
                    placeholder="如：teacher@example.com"
                    value={form.email}
                    onChange={handleChange('email')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailRoundedIcon color="primary" fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* 2. 課程說明 */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={4}
                    label="課程說明"
                    placeholder="請詳細描述課程目標、適合對象、授課內容與評分方式..."
                    value={form.lessonDescribe}
                    onChange={handleChange('lessonDescribe')}
                  />
                </Grid>

                {/* 按鈕組 */}
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate(-1)}
                      disabled={loading}
                      sx={{ borderRadius: '12px', px: 4 }}
                    >
                      取消
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveRoundedIcon />}
                      sx={{ borderRadius: '12px', px: 4 }}
                    >
                      {loading ? '建立中...' : '建立課程'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)} sx={{ width: '100%', borderRadius: '10px' }}>
          課程已成功建立！即將返回主頁...
        </Alert>
      </Snackbar>
    </Box>
  )
}
