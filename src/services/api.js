// import axios from 'axios'

// const api = axios.create({
//   baseURL: '/api',
//   timeout: 10000,
//   headers: { 'Content-Type': 'application/json' }
// })

// api.interceptors.response.use(
//   res => res,
//   err => {
//     console.error('[API Error]', err?.response?.status, err?.message)
//     return Promise.reject(err)
//   }
// )

// export default api
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://ai-figma-4.onrender.com',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.response.use(
  res => res,
  err => {
    console.error('[API Error]', err?.response?.status, err?.message)
    return Promise.reject(err)
  }
)

export default api