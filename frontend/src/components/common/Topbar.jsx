import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useLocation, useNavigate } from 'react-router-dom'
import { teacherMenuItems, studentMenuItems } from '@data/menuItems'

export default function Topbar({ isTeacher, onOpenCreateEmployee, setLoggedIn, setCurrentUser }) {
  const navigate = useNavigate()
  const location = useLocation()
  
  const currentMenu = (isTeacher ? teacherMenuItems : studentMenuItems).find((m) =>
    m.path === location.pathname
  )

  const getPageTitle = () => {
    if (currentMenu) {
      return currentMenu.label
    }
    if (location.pathname === '/create_lesson') {
      return '新增課程'
    }
    return 'Dashboard'
  }

  return (
    <AppBar position="static" color="transparent" elevation={0} className="topbar">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight={700}>
            {getPageTitle()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            目前登入身分：{isTeacher ? '教師 (Teacher)' : '學生 (Student)'}
          </Typography>
        </Box>
        {location.pathname === '/teacher_courses' && isTeacher && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create_lesson')}
          >
            新增課程
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}
