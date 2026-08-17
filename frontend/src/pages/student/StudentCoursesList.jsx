import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Container,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

import SearchRoundedIcon from '@mui/icons-material/SearchRounded'

import Topbar from '@components/common/Topbar'
import SidebarMenu from '@components/common/SidebarMenu'
import { studentApi, authApi, lessonApi } from '@lib/api'
import { clearAuthUser } from '@lib/authStorage'
import { getLessonStatusText, getLessonStatusColor } from '@lib/lessonUtils'


export default function StudentCoursesList({ userRole, currentUser, setLoggedIn, setCurrentUser }) {
  const navigate = useNavigate()
  const [courseSearch, setCourseSearch] = useState('')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const isStudent = userRole === 'student'

  useEffect(() => {
    const fetchCourses = async () => {
      if (!currentUser?.id) {
        setError('無法取得學生資訊')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const dataMap = await studentApi.getLessonList(currentUser.id)
        // 將後端返回的 map 轉換為陣列
        const coursesArray = Object.entries(dataMap || {}).map(([id, info]) => ({
          id: parseInt(id),
          lessonName: info.name,
          lessonTime: info.lessonTime,
          status: info.status,
          isJoined: info.isJoined === 'true'
        }))
        setCourses(coursesArray)
      } catch (err) {
        setError(err.message || '無法載入學生課程列表')
        console.error('Error fetching courses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [currentUser?.id])

  const filteredCourses = courses.filter(
    (course) =>
      course.lessonName?.toLowerCase().includes(courseSearch.toLowerCase()) ||
      course.lessonTime?.toLowerCase().includes(courseSearch.toLowerCase()),
  )


  const handleCourseClick = async (courseId, isJoined) => {
    try {

      var studentId = parseInt(currentUser.id)

      if (isJoined) {
        await lessonApi.cancelLesson({ studentId: studentId, lessonId: courseId })
      } else {
        await lessonApi.joinLesson({ studentId: studentId, lessonId: courseId })
      }
      // 操作成功後重新載入課程列表
      const dataMap = await studentApi.getLessonList(currentUser.id)
      const coursesArray = Object.entries(dataMap || {}).map(([id, info]) => ({
        id: parseInt(id),
        lessonName: info.name,
        lessonTime: info.lessonTime,
        status: info.status,
        isJoined: info.isJoined === 'true'
      }))
      setCourses(coursesArray)
    } catch (error) {
      console.error('Join/Cancel lesson request failed:', error)
      setError(error.message || '操作失敗')
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
    navigate('/login/student')
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <SidebarMenu isStudent={isStudent} onLogout={handleLogout} />
      
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar 
          isStudent={isStudent}
          setLoggedIn={setLoggedIn} 
          setCurrentUser={setCurrentUser} 
        />
        
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              課程列表
            </Typography>
            <Typography variant="body2" color="text.secondary">
              查看和管理所有開設的課程
            </Typography>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Paper className="table-panel" elevation={0}>
                {/* <Box className="table-toolbar">
                  <TextField
                    size="small"
                    placeholder="搜尋課程名稱、代號或教師"
                    value={courseSearch}
                    onChange={(event) => setCourseSearch(event.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRoundedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ minWidth: 280 }}
                  />
                  <Chip label={`共 ${filteredCourses.length} 門課程`} color="primary" variant="outlined" />
                </Box> */}


                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>課程名稱</TableCell>
                        <TableCell>上課時間</TableCell>
                        <TableCell>狀態</TableCell>
                        <TableCell align="center">操作</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                            <CircularProgress />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                              載入中...
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : filteredCourses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                            <Typography variant="body2" color="text.secondary">
                              {courseSearch ? '沒有符合搜尋條件的課程' : '目前沒有課程'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCourses.map((course) => (
                          <TableRow key={course.id} hover>
                            <TableCell>
                              <Typography fontWeight={600}>{course.lessonName}</Typography>
                            </TableCell>
                            <TableCell>{course.lessonTime || '-'}</TableCell>
                            <TableCell>
                              <Chip
                                label={getLessonStatusText(course.status)}
                                size="small"
                                color={getLessonStatusColor(course.status)}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                size="small"
                                variant={course.isJoined ? 'outlined' : 'contained'}
                                color={course.isJoined ? 'error' : 'primary'}
                                onClick={() => handleCourseClick(course.id, course.isJoined)}
                              >
                                {course.isJoined ? '取消報名' : '報名'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
          </Paper>
        </Container>
      </Box>
    </Box>
  )
}
