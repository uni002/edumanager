<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-logo">
        <i class="fa-solid fa-graduation-cap"></i>
        <h1>EduClass Manager</h1>
        <p class="text-muted">새 계정을 만들어 시작하세요</p>
      </div>

      <form @submit.prevent="handleRegister" novalidate>
        <div class="mb-3">
          <label class="form-label fw-semibold">이름</label>
          <div class="input-group">
            <span class="input-group-text"><i class="fa-solid fa-user text-muted"></i></span>
            <input
              v-model="form.name"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.name }"
              placeholder="이름을 입력하세요"
            />
            <div class="invalid-feedback">{{ errors.name }}</div>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">아이디 (영문/숫자)</label>
          <div class="input-group">
            <span class="input-group-text"><i class="fa-solid fa-id-badge text-muted"></i></span>
            <input
              v-model="form.username"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.username }"
              placeholder="아이디를 입력하세요"
              autocomplete="username"
            />
            <div class="invalid-feedback">{{ errors.username }}</div>
          </div>
        </div>

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
              placeholder="비밀번호 (6자 이상)"
              autocomplete="new-password"
            />
            <button type="button" class="input-group-text btn-eye" @click="showPw = !showPw">
              <i :class="showPw ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" class="text-muted"></i>
            </button>
            <div class="invalid-feedback">{{ errors.password }}</div>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">비밀번호 확인</label>
          <div class="input-group">
            <span class="input-group-text"><i class="fa-solid fa-lock text-muted"></i></span>
            <input
              v-model="form.confirmPassword"
              :type="showPw2 ? 'text' : 'password'"
              class="form-control"
              :class="{ 'is-invalid': errors.confirmPassword }"
              placeholder="비밀번호를 다시 입력하세요"
              autocomplete="new-password"
            />
            <button type="button" class="input-group-text btn-eye" @click="showPw2 = !showPw2">
              <i :class="showPw2 ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" class="text-muted"></i>
            </button>
            <div class="invalid-feedback">{{ errors.confirmPassword }}</div>
          </div>
        </div>

        <!-- 비밀번호 강도 표시 -->
        <div v-if="form.password" class="mb-3">
          <div class="d-flex justify-content-between mb-1">
            <small class="text-muted">비밀번호 강도</small>
            <small :class="strengthColor">{{ strengthLabel }}</small>
          </div>
          <div class="progress" style="height: 5px;">
            <div class="progress-bar" :class="strengthBarClass" :style="{ width: strengthWidth }"></div>
          </div>
        </div>

        <div v-if="errorMsg" class="alert alert-danger py-2 small">
          <i class="fa-solid fa-circle-exclamation me-1"></i>{{ errorMsg }}
        </div>

        <button type="submit" class="btn btn-primary w-100 py-2 mt-1" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="fa-solid fa-user-plus me-2"></i>
          {{ loading ? '가입 중...' : '회원가입' }}
        </button>
      </form>

      <div class="auth-footer">
        <span class="text-muted">이미 계정이 있으신가요?</span>
        <router-link to="/login" class="ms-1 fw-semibold text-primary text-decoration-none">로그인</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({ name: '', username: '', email: '', password: '', confirmPassword: '' })
const errors = ref({})
const errorMsg = ref('')
const loading = ref(false)
const showPw = ref(false)
const showPw2 = ref(false)

// 비밀번호 강도
const passwordStrength = computed(() => {
  const pw = form.value.password
  if (!pw) return 0
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
})

const strengthLabel = computed(() => {
  const s = passwordStrength.value
  if (s <= 1) return '약함'
  if (s <= 3) return '보통'
  return '강함'
})

const strengthColor = computed(() => {
  const s = passwordStrength.value
  if (s <= 1) return 'text-danger'
  if (s <= 3) return 'text-warning'
  return 'text-success'
})

const strengthBarClass = computed(() => {
  const s = passwordStrength.value
  if (s <= 1) return 'bg-danger'
  if (s <= 3) return 'bg-warning'
  return 'bg-success'
})

const strengthWidth = computed(() => `${Math.min((passwordStrength.value / 5) * 100, 100)}%`)

function validate() {
  errors.value = {}
  if (!form.value.name.trim()) errors.value.name = '이름을 입력하세요.'
  if (!form.value.username.trim()) errors.value.username = '아이디를 입력하세요.'
  else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.value.username)) errors.value.username = '영문, 숫자, 언더바 3~20자로 입력하세요.'
  if (!form.value.email) errors.value.email = '이메일을 입력하세요.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errors.value.email = '올바른 이메일 형식이 아닙니다.'
  if (!form.value.password) errors.value.password = '비밀번호를 입력하세요.'
  else if (form.value.password.length < 6) errors.value.password = '비밀번호는 6자 이상이어야 합니다.'
  if (!form.value.confirmPassword) errors.value.confirmPassword = '비밀번호 확인을 입력하세요.'
  else if (form.value.password !== form.value.confirmPassword) errors.value.confirmPassword = '비밀번호가 일치하지 않습니다.'
  return Object.keys(errors.value).length === 0
}

async function handleRegister() {
  errorMsg.value = ''
  if (!validate()) return
  loading.value = true
  try {
    await authStore.register({
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      name: form.value.name
    })
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
  margin: 2rem auto;
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
</style>
