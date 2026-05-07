<template>
  <template v-if="authStore.isLoggedIn">
    <div class="d-flex flex-column flex-md-row">
      <aside class="sidebar">
        <div class="brand"><i class="fa-solid fa-graduation-cap me-2"></i>EduClass Manager</div>
        <nav class="nav flex-column">
          <router-link class="nav-link" to="/"><i class="fa-solid fa-gauge-high"></i>대시보드</router-link>
          <router-link class="nav-link" to="/students"><i class="fa-solid fa-user-graduate"></i>학생 관리</router-link>
          <router-link class="nav-link" to="/attendance"><i class="fa-solid fa-clipboard-check"></i>출결 관리</router-link>
          <router-link class="nav-link" to="/payments"><i class="fa-solid fa-credit-card"></i>학원비 납부</router-link>
          <router-link class="nav-link" to="/unpaid"><i class="fa-solid fa-triangle-exclamation"></i>미납 관리</router-link>
          <router-link class="nav-link" to="/consultations"><i class="fa-solid fa-comments"></i>상담 이력</router-link>
          <router-link class="nav-link" to="/makeup"><i class="fa-solid fa-calendar-plus"></i>보강 수업</router-link>
          <router-link class="nav-link" to="/classes"><i class="fa-solid fa-chalkboard-user"></i>반/강사 관리</router-link>
          <router-link class="nav-link" to="/payment-history"><i class="fa-solid fa-receipt"></i>결제 내역</router-link>
        </nav>

        <!-- 사이드바 하단 사용자 정보 -->
        <div class="sidebar-user">
          <div class="user-avatar">
            <i class="fa-solid fa-circle-user"></i>
          </div>
          <div class="user-info">
            <div class="user-name">{{ authStore.user?.name }}</div>
            <div class="user-role">{{ authStore.user?.role === 'admin' ? '관리자' : '사용자' }}</div>
          </div>
          <button class="btn-logout" @click="handleLogout" title="로그아웃">
            <i class="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </aside>

      <div class="main-area">
        <header class="topbar">
          <div>
            <i class="fa-solid fa-magnifying-glass text-muted me-2"></i>
            <span class="text-muted">EduClass 관리자</span>
          </div>
          <div class="topbar-right">
            <span class="topbar-username me-3">
              <i class="fa-solid fa-circle-user me-1 text-secondary"></i>
              {{ authStore.user?.name }}
              <span class="badge bg-primary ms-1" v-if="authStore.user?.role === 'admin'">관리자</span>
            </span>
            <button class="btn btn-sm btn-outline-secondary" @click="handleLogout">
              <i class="fa-solid fa-right-from-bracket me-1"></i>로그아웃
            </button>
          </div>
        </header>
        <main class="p-3 p-md-4">
          <router-view />
        </main>
      </div>
    </div>
  </template>

  <!-- 비로그인: 로그인/회원가입 페이지 -->
  <template v-else>
    <router-view />
  </template>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.topbar-right {
  display: flex;
  align-items: center;
}

.topbar-username {
  font-size: 0.9rem;
  color: #4a5568;
  font-weight: 500;
}

/* 사이드바 하단 사용자 영역 */
.sidebar-user {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

.user-avatar i {
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.75);
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.55);
}

.btn-logout {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0.3rem 0.4rem;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
  flex-shrink: 0;
}
.btn-logout:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}
</style>
