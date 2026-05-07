<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-logo">
        <i class="fa-solid fa-graduation-cap"></i>
        <h1>EduClass Manager</h1>
        <p class="text-muted">학원 관리 시스템에 로그인하세요</p>
      </div>

      <form @submit.prevent="handleLogin" novalidate>
        <div class="mb-3">
          <label class="form-label fw-semibold">이메일</label>
          <div class="input-group">
            <span class="input-group-text"><i class="fa-solid fa-envelope text-muted"></i></span>
            <input
              v-model="form.email"
              type="email"
              class="form-control"
              :class="{ 'is-invalid': errors.email }"
              placeholder="이메일을 입력하세요"
              autocomplete="email"
            />
            <div class="invalid-feedback">{{ errors.email }}</div>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">비밀번호</label>
          <div class="input-group">
            <span class="input-group-text"><i class="fa-solid fa-lock text-muted"></i></span>
            <input
              v-model="form.password"
              :type="showPw ? 'text' : 'password'"
              class="form-control"
              :class="{ 'is-invalid': errors.password }"
              placeholder="비밀번호를 입력하세요"
              autocomplete="current-password"
            />
            <button type="button" class="input-group-text btn-eye" @click="showPw = !showPw">
              <i :class="showPw ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" class="text-muted"></i>
            </button>
            <div class="invalid-feedback">{{ errors.password }}</div>
          </div>
        </div>

        <div v-if="errorMsg" class="alert alert-danger py-2 small">
          <i class="fa-solid fa-circle-exclamation me-1"></i>{{ errorMsg }}
        </div>

        <button type="submit" class="btn btn-primary w-100 py-2 mt-1" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="fa-solid fa-right-to-bracket me-2"></i>
          {{ loading ? '로그인 중...' : '로그인' }}
        </button>
      </form>

      <div class="auth-footer">
        <span class="text-muted">계정이 없으신가요?</span>
        <router-link to="/register" class="ms-1 fw-semibold text-primary text-decoration-none">회원가입</router-link>
      </div>

      <div class="auth-hint">
        <span class="badge bg-light text-secondary border">
          <i class="fa-solid fa-circle-info me-1"></i>
          기본 계정: admin@educlass.com / admin1234
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({ email: '', password: '' })
const errors = ref({})
const errorMsg = ref('')
const loading = ref(false)
const showPw = ref(false)

function validate() {
  errors.value = {}
  if (!form.value.email) errors.value.email = '이메일을 입력하세요.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errors.value.email = '올바른 이메일 형식이 아닙니다.'
  if (!form.value.password) errors.value.password = '비밀번호를 입력하세요.'
  return Object.keys(errors.value).length === 0
}

async function handleLogin() {
  errorMsg.value = ''
  if (!validate()) return
  loading.value = true
  try {
    await authStore.login(form.value.email, form.value.password)
    router.push('/')
  } catch (e) {
    errorMsg.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.auth-card {
  background: #fff;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}

.auth-logo {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-logo i {
  font-size: 2.5rem;
  color: #667eea;
  margin-bottom: 0.5rem;
  display: block;
}

.auth-logo h1 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.auth-logo p {
  font-size: 0.875rem;
}

.btn-eye {
  cursor: pointer;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-left: none;
}
.btn-eye:hover { background: #e9ecef; }

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
}

.auth-hint {
  text-align: center;
  margin-top: 1rem;
}
</style>
