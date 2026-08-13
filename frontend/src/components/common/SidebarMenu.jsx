import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import { useLocation, useNavigate } from 'react-router-dom'
import { teacherMenuItems, studentMenuItems } from '@data/menuItems'

export default function SidebarMenu({ isTeacher, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()

  const isSelected = (item) => {
    if (item.path) {
      return location.pathname === item.path
    }
    return false
  }

  return (
    <Drawer variant="permanent" className="sidebar" open>
      <Box className="sidebar-header">
        <Avatar sx={{ bgcolor: isTeacher ? '#1e3a8a' : '#0d9488' }}>
          {isTeacher ? <SchoolRoundedIcon /> : <MenuBookRoundedIcon />}
        </Avatar>
        <Box>
          <Typography variant="h6">學習平台</Typography>
          <Chip
            label={isTeacher ? '教師身份' : '學生身份'}
            size="small"
            color={isTeacher ? 'primary' : 'success'}
            variant="outlined"
          />
        </Box>
      </Box>

      <List>
        {(isTeacher ? teacherMenuItems : studentMenuItems).map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={isSelected(item)}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <Button
        startIcon={<LogoutRoundedIcon />}
        className="logout-button"
        onClick={onLogout}
      >
        Sign out
      </Button>
    </Drawer>
  )
}
