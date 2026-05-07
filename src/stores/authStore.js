import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('edu_user') || 'null'))
  const isLoggedIn = computed(() => !!user.value)

  async function login(email, password) {
    const res = await api.get('/users', { params: { email, password } })
    if (res.data.length === 0) throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
    const found = res.data[0]
    user.value = { id: found.id, name: found.name, email: found.email, role: found.role, username: found.username }
    localStorage.setItem('edu_user', JSON.stringify(user.value))
  }

  async function register({ username, email, password, name }) {
    // 이메일 중복 확인
    const check = await api.get('/users', { params: { email } })
    if (check.data.length > 0) throw new Error('이미 사용 중인 이메일입니다.')
    const res = await api.post('/users', {
      username, email, password, name,
      role: 'user',
      createdAt: new Date().toISOString().slice(0, 10)
    })
    const created = res.data
    user.value = { id: created.id, name: created.name, email: created.email, role: created.role, username: created.username }
    localStorage.setItem('edu_user', JSON.stringify(user.value))
  }

  function logout() {
    user.value = null
    localStorage.removeItem('edu_user')
  }

  return { user, isLoggedIn, login, register, logout }
})
