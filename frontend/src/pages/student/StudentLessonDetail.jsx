import { useState, useEffect } from 'react'
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
  Stack,
  TextField,
  Typography,
  Chip,
  Divider,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import { useNavigate, useParams } from 'react-router-dom'
import { lessonApi } from '@lib/api'
import { getLessonStatusText, getLessonStatusColor } from '@lib/lessonUtils'

export default function StudentLessonDetail() {
  const navigate = useNavigate()
  const { lessonId } = useParams()
  
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')


  useEffect(() => {
    const fetchLessonDetail = async () => {
      try {
        setLoading(true)
        const data = await lessonApi.getById(lessonId)
        setLesson(data.lesson)
      } catch (error) {
        console.error('Failed to fetch lesson detail:', error)
        setErrorMessage(error.message || '無法載入課程資訊')
      } finally {
        setLoading(false)
      }
    }

    if (lessonId) {
      fetchLessonDetail()
    }
  }, [lessonId])

  if (loading) {
    return (
      <Box sx={{ py: 4, px: 2, minHeight: '100vh', background: '#f5f7fb', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (errorMessage || !lesson) {
    return (
      <Box sx={{ py: 4, px: 2, minHeight: '100vh', background: '#f5f7fb' }}>
        <Container maxWidth="md">
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
            {errorMessage || '課程不存在'}
          </Alert>
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate(-1)}
            variant="outlined"
            sx={{ borderRadius: '10px', backgroundColor: '#fff' }}
          >
            返回
          </Button>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ py: 4, px: 2, minHeight: '100vh', background: '#f5f7fb' }}>
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
              課程詳情
            </Typography>
            <Typography variant="body2" color="text.secondary">
              查看課程的完整資訊
            </Typography>
          </Box>
        </Stack>

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
            <Grid 
              container 
              spacing={3}
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
            >
              {/* 課程名稱 */}
              <Grid item xs={12} sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label="課程名稱"
                  value={lesson.lessonName || ''}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <MenuBookRoundedIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* 課程狀態 */}
              <Grid item xs={12} sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
                    課程狀態：
                  </Typography>
                  <Chip
                    label={getLessonStatusText(lesson.status)}
                    color={getLessonStatusColor(lesson.status)}
                  />
                </Box>
              </Grid>

              {/* 課程費用 */}
              <Grid item xs={12} sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label="課程費用"
                  value={lesson.tuitionFee || ''}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyRoundedIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* 課程時間 */}
              <Grid item xs={12} sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label="課程時間"
                  value={lesson.lessonTime || ''}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarMonthRoundedIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* 課程地點 */}
              <Grid item xs={12} sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label="課程地點"
                  value={lesson.lessonAddress || ''}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnRoundedIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* 報名日期 */}
              <Grid item xs={12} sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label="報名日期"
                  value={`${lesson.signupStartDate || ''} ~ ${lesson.signupEndDate || ''}`}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <EventAvailableRoundedIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* 聯絡信箱 */}
              <Grid item xs={12} sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label="聯絡信箱"
                  value={lesson.email || ''}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailRoundedIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* 授課教師 */}
              {lesson.teacherName && (
                <Grid item xs={12} sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    label="授課教師"
                    value={lesson.teacherName || ''}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonRoundedIcon color="primary" fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              )}

              <Grid item xs={12} sx={{ width: '100%' }}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              {/* 課程說明 */}
              <Grid item xs={12} sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="課程說明"
                  value={lesson.lessonDescribe || ''}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              {/* 按鈕組 */}
              <Grid item xs={12} sx={{ width: '100%' }}>
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate(-1)}
                    sx={{ borderRadius: '12px', px: 4 }}
                  >
                    返回課程列表
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}
