import { useState, useEffect } from 'react'
import { 
  Box, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography,
  Stack,
  Divider,
  Button
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import SidebarMenu from '@components/common/SidebarMenu'
import Topbar from '@components/common/Topbar'
import { teacherApi, studentApi, authApi } from '@lib/api'
import { clearAuthUser } from '@lib/authStorage'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import EventIcon from '@mui/icons-material/Event'
import PersonIcon from '@mui/icons-material/Person'
import PeopleIcon from '@mui/icons-material/People'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

export default function OverviewPage({ 
  userRole, 
  currentUser,
  setLoggedIn, 
  setCurrentUser 
}) {
  const navigate = useNavigate()
  const isTeacher = userRole === 'teacher'
  
  // 即將開始報名的課程
  const [upcomingRegistrations, setUpcomingRegistrations] = useState([])
  // 快要結束報名的課程
  const [endingRegistrations, setEndingRegistrations] = useState([])

  useEffect(() => {
    getOverview()
  }, [])


  const getOverview = async () => {
    try {
      const overview = isTeacher ? await teacherApi.overview() : await studentApi.overview()

      setUpcomingRegistrations(overview.beginningOpenLessons)
      setEndingRegistrations(overview.endingOpenLessons)
    } catch (error) {
      console.error('Get overview request failed:', error)
    }
  }

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

  const LessonCard = ({ lesson }) => (
    <Card 
      sx={{ 
        mb: 2, 
        '&:hover': { 
          boxShadow: 4,
          transform: 'translateY(-2px)',
          transition: 'all 0.3s'
        }
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {lesson.lessonName}
        </Typography>
        
        <Stack spacing={1.5} sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              報名開始：
              <span style={{ fontWeight: 500, color: '#1976d2' }}>
                {lesson.signupStartDate}
              </span>
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              上課日期：{lesson.lessonTime}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              授課教師：{lesson.Teachers[0].teacherName}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<InfoOutlinedIcon />}
              onClick={() => navigate(`/student_lesson/${lesson.id}`)}
              sx={{ 
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              查看課程詳情
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )

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
          <Grid container spacing={3}>
            {/* 左側：即將開始報名 */}
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 3, 
                backgroundColor: 'white', 
                borderRadius: 2,
                boxShadow: 1
              }}>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    color: '#1976d2',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <AccessTimeIcon />
                  即將開始報名
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                {upcomingRegistrations.length > 0 ? (
                  upcomingRegistrations.map(lesson => (
                    <LessonCard key={lesson.id} lesson={lesson} />
                  ))
                ) : (
                  <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    目前沒有即將開始報名的課程
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* 右側：快要結束報名 */}
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 3, 
                backgroundColor: 'white', 
                borderRadius: 2,
                boxShadow: 1
              }}>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    color: '#d32f2f',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <EventIcon />
                  快要結束報名
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                {endingRegistrations.length > 0 ? (
                  endingRegistrations.map(lesson => (
                    <LessonCard key={lesson.id} lesson={lesson} />
                  ))
                ) : (
                  <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    目前沒有快要結束報名的課程
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}
