<template>
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
    </aside>
    <div class="main-area">
      <header class="topbar">
        <div><i class="fa-solid fa-magnifying-glass text-muted me-2"></i><span class="text-muted">EduClass 관리자</span></div>
        <div><i class="fa-solid fa-circle-user fa-lg text-secondary"></i></div>
      </header>
      <main class="p-3 p-md-4">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup></script>
