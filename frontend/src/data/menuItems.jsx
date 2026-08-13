import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded'
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded'

export const teacherMenuItems = [
  { id: 'overview', label: '系統總覽', icon: <DashboardRoundedIcon />, path: '/home' },
  { id: 'courses', label: '課程列表', icon: <AutoStoriesRoundedIcon />, path: '/teacher_courses' },
  { id: 'profile', label: '個人資料編輯', icon: <ManageAccountsRoundedIcon />, path: '/teacher_profile' },
  { id: 'security', label: '系統安全', icon: <ShieldRoundedIcon />, path: '/security' },
]


export const studentMenuItems = [
  { id: 'overview', label: '系統總覽', icon: <DashboardRoundedIcon />, path: '/home' },
  { id: 'courses', label: '課程列表', icon: <AutoStoriesRoundedIcon />, path: '/student_courses' },
  { id: 'profile', label: '個人資料編輯', icon: <ManageAccountsRoundedIcon />, path: '/student_profile' },
  { id: 'security', label: '系統安全', icon: <ShieldRoundedIcon />, path: '/security' },
]