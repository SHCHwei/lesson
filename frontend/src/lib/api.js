const API_BASE_URL = import.meta.env.VITE_API_BASE_URL !== undefined ? import.meta.env.VITE_API_BASE_URL : 'http://localhost:8080'

function buildUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}

async function request(path, { method = 'GET', body, headers = {}, params } = {}) {
  const url = new URL(buildUrl(path), window.location.origin)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value))
      }
    })
  }

  const options = {
    method,
    credentials: 'include',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      ...headers,
    },
  }

  if (body !== undefined) {
    options.body = JSON.stringify(body)
    options.headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(url, options)
  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : await response.text()

  if (response.status === 401) {
    window.dispatchEvent(new Event('auth:unauthorized'))
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || 'Request failed')
  }

  return data
}

export const api = {
  get: (path, config) => request(path, { ...config, method: 'GET' }),
  post: (path, body, config) => request(path, { ...config, body, method: 'POST' }),
  put: (path, body, config) => request(path, { ...config, body, method: 'PUT' }),
  del: (path, config) => request(path, { ...config, method: 'DELETE' }),
}

export const authApi = {
  teacherLogin: (payload) => api.post('/api/v1/teacher/login', payload),
  studentLogin: (payload) => api.post('/api/v1/student/login', payload),
  teacherRegister: (payload) => api.post('/api/v1/teacher/create', payload),
  studentRegister: (payload) => api.post('/api/v1/student/create', payload),
  logout: () => api.post('/api/v1/Logout'),
}

export const teacherApi = {
  list: () => api.get('/api/v1/teachers/'),
  getById: (id) => api.get(`/api/v1/teachers/${id}`),
  getLessonList: (id) => api.get(`/api/v1/teachers/${id}/lessonList`),
  create: (payload) => api.post('/api/v1/teachers/', payload),
  update: (id, payload) => api.put(`/api/v1/teachers/${id}`, payload),
  remove: (id) => api.del(`/api/v1/teachers/${id}`),
}

export const studentApi = {
  list: () => api.get('/api/v1/students/'),
  getLessonList: (id) => api.get(`/api/v1/students/${id}/lessonList`),
  getById: (id) => api.get(`/api/v1/students/${id}`),
  create: (payload) => api.post('/api/v1/students/', payload),
  update: (id, payload) => api.put(`/api/v1/students/${id}`, payload),
  remove: (id) => api.del(`/api/v1/students/${id}`),
}

export const lessonApi = {
  list: () => api.get('/api/v1/lessons/'),
  getById: (id) => api.get(`/api/v1/lessons/${id}`),
  create: (payload) => api.post('/api/v1/lessons/', payload),
  update: (id, payload) => api.put(`/api/v1/lessons/${id}`, payload),
  remove: (id) => api.del(`/api/v1/lessons/${id}`),
  joinLesson: (payload) => api.post('/api/v1/lessons/joinLesson', payload),
  cancelLesson: (payload) => api.post('/api/v1/lessons/cancelLesson', payload),
}
