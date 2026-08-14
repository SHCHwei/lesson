
# SideProject - 學習平台

## 主旨

這專案是我的GO實作練習，使用Go語言建制基本CURD和登入功能。前端則是使用 react + vite 建立，為了專注於後端製作和後續部署練習，前端大部分 AI agent 製作。
此專案會部署到 railway.app

網址 ： https://elegant-cooperation-production-0f50.up.railway.app/


## 環境

### 開發環境
- **Go**: 1.23.12
- **Node.js**: 18+ (for React + Vite)
- **Docker & Docker Compose**: 用於容器化部署

### 資料庫與快取
- **MariaDB**: 12.3.2 (主要資料庫)
- **Redis**: 7-alpine (Session 管理與快取)

### 後端技術棧
- **Web 框架**: [Gin](https://github.com/gin-gonic/gin) v1.10.0
- **ORM**: [GORM](https://gorm.io/) v1.31.2
- **JWT 認證**: golang-jwt/jwt v5.3.1
- **Redis 客戶端**: go-redis v8.11.5
- **密碼加密**: golang.org/x/crypto
- **熱重載**: Air (開發環境)

### 前端技術棧
- **框架**: React 18.3.1
- **建構工具**: Vite 5.4.10
- **UI 框架**: Material-UI (MUI) v5.18.0
- **路由**: React Router DOM v7.18.2
- **程式碼檢查**: OxLint v1.75.0

### 容器服務
- **lesson-db**: MariaDB 資料庫服務 (Port: 3306)
- **lesson-redis**: Redis 快取服務 (Port: 6379)
- **lesson-backend**: Go 後端服務 (Port: 8080)
- **lesson-frontend**: React 前端服務 (Port: 5173)

## 架構

### 系統架構
```
┌─────────────┐
│   Frontend  │  React + Vite + MUI
│  (Port 5173)│
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────┐
│   Backend   │  Go + Gin Framework
│  (Port 8080)│
└──────┬──────┘
       │
       ├──────────┐
       ▼          ▼
┌──────────┐  ┌────────┐
│ MariaDB  │  │ Redis  │
│(Port 3306)│  │(Port 6379)│
└──────────┘  └────────┘
```

### 後端分層架構
```
backend/
├── main.go                 # 應用程式入口
├── config/                 # 配置管理
│   └── config.go
├── router/                 # 路由設定
│   └── router.go
├── middleware/             # 中介層
│   ├── auth.go            # JWT 認證中介層
│   ├── cors.go            # CORS 設定
│   └── middleware.go
├── handler/                # HTTP 處理層 (Controller)
│   ├── login_handler.go
│   ├── lesson_handler.go
│   ├── student_handler.go
│   └── teacher_handler.go
├── services/               # 業務邏輯層 (Service)
│   ├── login_services.go
│   ├── lesson_service.go
│   ├── student_service.go
│   └── teacher_service.go
├── repository/             # 資料存取層 (Repository)
├── models/                 # 資料模型
│   ├── user.go
│   ├── student.go
│   ├── teacher.go
│   ├── lesson.go
│   ├── lesson_student.go
│   └── lesson_teacher.go
├── database/               # 資料庫連接
│   ├── database.go
│   ├── mariadb.go
│   └── redis.go
└── utils/                  # 工具函式
    ├── jwt.go             # JWT 工具
    ├── password.go        # 密碼加密
    ├── session.go         # Session 管理
    └── lesson.go
```

### 前端架構
```
frontend/src/
├── main.jsx               # 應用程式入口
├── App.jsx                # 根元件
├── routes/                # 路由配置
│   └── AppRoutes.jsx
├── pages/                 # 頁面元件
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── OverviewPage.jsx
│   ├── SecurityPage.jsx
│   ├── student/           # 學生相關頁面
│   │   ├── StudentRegisterPage.jsx
│   │   ├── StudentProfile.jsx
│   │   └── StudentCoursesList.jsx
│   └── teacher/           # 教師相關頁面
│       ├── TeacherRegisterPage.jsx
│       ├── TeacherProfile.jsx
│       ├── TeacherCoursesList.jsx
│       ├── CreateLessonPage.jsx
│       └── EditLessonPage.jsx
├── components/            # 共用元件
│   └── common/
│       ├── Topbar.jsx
│       └── SidebarMenu.jsx
├── lib/                   # 核心工具
│   ├── api.js            # API 請求封裝
│   ├── authStorage.js    # 認證資料儲存
│   └── lessonUtils.js    # 課程工具函式
└── data/                  # 靜態資料
    └── menuItems.jsx     # 選單項目配置
```

### 資料流向
1. **使用者請求** → Frontend (React)
2. **HTTP 請求** → Backend API (Gin Router)
3. **路由分發** → Handler (處理 HTTP 請求)
4. **業務處理** → Service (業務邏輯)
5. **資料操作** → Repository (資料存取)
6. **資料儲存** → Database (MariaDB) / Cache (Redis)
7. **回傳結果** → Service → Handler → Frontend

### 認證機制
- **JWT Token**: 用於 API 認證
- **Session**: 使用 Redis 儲存使用者 Session
- **Middleware**: 路由層級的認證檢查



