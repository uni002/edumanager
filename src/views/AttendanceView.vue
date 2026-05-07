<template>
  <div>
    <h3 class="mb-3"><i class="fa-solid fa-clipboard-check me-2 text-primary"></i>출결 관리</h3>
    <div class="card p-3 mb-3">
      <div class="row g-2 align-items-end">
        <div class="col-md-3"><label class="form-label">날짜</label><input type="date" v-model="date" class="form-control" /></div>
        <div class="col-md-3"><label class="form-label">반</label>
          <select v-model="classFilter" class="form-select">
            <option value="">전체</option>
            <option v-for="c in classS.items" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div class="col-md-6 text-end">
          <span class="badge bg-success me-2">출석 {{ summary.출석 }}</span>
          <span class="badge bg-warning me-2">지각 {{ summary.지각 }}</span>
          <span class="badge bg-danger me-2">결석 {{ summary.결석 }}</span>
          <span class="badge bg-secondary">조퇴 {{ summary.조퇴 }}</span>
        </div>
      </div>
    </div>

    <div class="card p-3">
      <table class="table align-middle">
        <thead><tr><th>학생</th><th>반</th><th>상태</th><th></th></tr></thead>
        <tbody>
          <tr v-for="s in filteredStudents" :key="s.id">
            <td>{{ s.name }}</td>
            <td>{{ className(s.classId) }}</td>
            <td>
              <select class="form-select form-select-sm" style="width:120px" v-model="statusMap[s.id]">
                <option value="">선택</option>
                <option>출석</option><option>지각</option><option>결석</option><option>조퇴</option>
              </select>
            </td>
            <td><button class="btn btn-sm btn-primary" @click="save(s)" :disabled="!statusMap[s.id]"><i class="fa-solid fa-save"></i> 저장</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStudentStore } from '../stores/studentStore'
import { useClassStore } from '../stores/classStore'
import { useAttendanceStore } from '../stores/attendanceStore'
import { todayStr } from '../utils/format'

const studentS = useStudentStore(); const classS = useClassStore(); const attS = useAttendanceStore()
const date = ref(todayStr())
const classFilter = ref('')
const statusMap = ref({})

onMounted(() => Promise.all([studentS.fetchAll(),classS.fetchAll(),attS.fetchAll()]))

const className = (id) => classS.items.find(c => c.id === id)?.name || '-'
const filteredStudents = computed(() => studentS.items.filter(s =>
  s.status === '재원' && (!classFilter.value || s.classId === Number(classFilter.value))
))

const summary = computed(() => {
  const r = { 출석:0,지각:0,결석:0,조퇴:0 }
  attS.items.filter(a => a.date === date.value).forEach(a => { if (r[a.status]!=null) r[a.status]++ })
  return r
})

const save = async (s) => {
  await attS.create({ studentId: s.id, classId: s.classId, date: date.value, status: statusMap.value[s.id], memo: '' })
  alert(`${s.name} 출결 저장됨`)
}
</script>
