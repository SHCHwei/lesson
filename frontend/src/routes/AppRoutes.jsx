import { Navigate, Route, Routes } from 'react-router-dom'
import CreateLessonPage from '@pages/teacher/CreateLessonPage'
import EditLessonPage from '@pages/teacher/EditLessonPage'
import StudentCoursesList from '@pages/student/StudentCoursesList'
import TeacherCoursesList from '@pages/teacher/TeacherCoursesList'
import OverviewPage from '@pages/OverviewPage'
import SecurityPage from '@pages/SecurityPage'
import LoginPage from '@pages/LoginPage'
import StudentRegisterPage from '@pages/student/StudentRegisterPage'
import TeacherRegisterPage from '@pages/teacher/TeacherRegisterPage'
import StudentProfile from '@pages/student/StudentProfile'
import TeacherProfile from '@pages/teacher/TeacherProfile'



export default function AppRoutes({
  loggedIn,
  setLoggedIn,
  userRole,
  setUserRole,
  currentUser,
  setCurrentUser,
}) {
  const requireAuth = (element) =>
    loggedIn ? element : <Navigate to="/login/teacher" replace />

  return (
    <Routes>
      <Route path="/" element={<Navigate to={loggedIn ? '/home' : '/login/teacher'} replace />} />
      <Route path="/login" element={<Navigate to="/login/teacher" replace />} />
      <Route
        path="/login/teacher"
        element={
          <LoginPage
            role="teacher"
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
            setUserRole={setUserRole}
            setCurrentUser={setCurrentUser}
          />
        }
      />
      <Route
        path="/login/student"
        element={
          <LoginPage
            role="student"
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
            setUserRole={setUserRole}
            setCurrentUser={setCurrentUser}
          />
        }
      />
      <Route path="/register" element={<Navigate to="/register/teacher" replace />} />
      <Route path="/register/teacher" element={<TeacherRegisterPage />} />
      <Route path="/register/student" element={<StudentRegisterPage />} />
      
      <Route
        path="/home"
        element={requireAuth(
          <OverviewPage
            userRole={userRole}
            currentUser={currentUser}
            setLoggedIn={setLoggedIn}
            setCurrentUser={setCurrentUser}
          />,
        )}
      />


      <Route
        path="/teacher_courses"
        element={requireAuth(
          <TeacherCoursesList
            userRole={userRole}
            currentUser={currentUser}
            setLoggedIn={setLoggedIn}
            setCurrentUser={setCurrentUser}
          />,
        )}
      />        


      <Route
        path="/student_courses"
        element={requireAuth(
          <StudentCoursesList
            userRole={userRole}
            currentUser={currentUser}
            setLoggedIn={setLoggedIn}
            setCurrentUser={setCurrentUser}
          />,
        )}
      />        


      <Route
        path="/create_lesson"
        element={requireAuth(
          <CreateLessonPage
            userRole={userRole}
            currentUser={currentUser}
            setLoggedIn={setLoggedIn}
            setCurrentUser={setCurrentUser}
          />,
        )}
      />


      <Route
        path="/courses/edit/:lessonID"
        element={requireAuth(
          <EditLessonPage
            userRole={userRole}
            currentUser={currentUser}
            setLoggedIn={setLoggedIn}
            setCurrentUser={setCurrentUser}
          />,
        )}
      />

      <Route
        path="/teacher_profile"
        element={requireAuth(
          <TeacherProfile currentUser={currentUser} setCurrentUser={setCurrentUser} />,
        )}
      />


      <Route 
        path="/student_profile" 
        element={requireAuth(
          <StudentProfile currentUser={currentUser} setCurrentUser={setCurrentUser}/>,
        )}
      />



      <Route
        path="/security"
        element={requireAuth(
          <SecurityPage
            userRole={userRole}
            currentUser={currentUser}
            setLoggedIn={setLoggedIn}
            setCurrentUser={setCurrentUser}
          />,
        )}
      />


      <Route path="*" element={<Navigate to={loggedIn ? '/home' : '/login/teacher'} replace />} />
    </Routes>
  )
}
