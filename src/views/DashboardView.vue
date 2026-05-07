<template>
  <div>
    <h3 class="mb-4"><i class="fa-solid fa-gauge-high me-2 text-primary"></i>대시보드</h3>

    <div class="row g-3 mb-4">
      <div class="col-md-3 col-6" v-for="c in cards" :key="c.label">
        <div class="card stat-card p-3">
          <div class="d-flex align-items-center gap-3">
            <div class="icon-box" :class="c.bg"><i :class="c.icon"></i></div>
            <div>
              <div class="text-muted small">{{ c.label }}</div>
              <div class="h4 mb-0 fw-bold">{{ c.value }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-lg-6">
        <div class="card p-3"><h6><i class="fa-solid fa-chart-line me-2 text-primary"></i>월별 수납 금액</h6>
          <GoogleChart type="LineChart" :data="revenueChart" :height="280" />
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card p-3"><h6><i class="fa-solid fa-chart-pie me-2 text-primary"></i>반별 학생 수</h6>
          <GoogleChart type="PieChart" :data="classChart" :height="280" />
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card p-3"><h6><i class="fa-solid fa-chart-column me-2 text-primary"></i>출결 현황</h6>
          <GoogleChart type="ColumnChart" :data="attChart" :height="280" />
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card p-3"><h6><i class="fa-solid fa-chart-bar me-2 text-primary"></i>미납 현황 (반별)</h6>
          <GoogleChart type="BarChart" :data="unpaidChart" :height="280" />
        </div>
      </div>
    </div>

    <div class="card mt-3 p-3">
      <h6><i class="fa-solid fa-comments me-2 text-primary"></i>최근 상담 이력</h6>
      <table class="table table-sm mt-2">
        <thead><tr><th>날짜</th><th>학생</th><th>유형</th><th>내용</th></tr></thead>
        <tbody>
          <tr v-for="c in recentConsults" :key="c.id">
            <td>{{ c.consultationDate }}</td>
            <td>{{ studentName(c.studentId) }}</td>
            <td><span class="badge bg-info">{{ c.type }}</span></td>
            <td>{{ c.content }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useStudentStore } from '../stores/studentStore'
import { usePaymentStore } from '../stores/paymentStore'
import { useAttendanceStore } from '../stores/attendanceStore'
import { useConsultationStore } from '../stores/consultationStore'
import { useMakeupStore } from '../stores/makeupStore'
import { useClassStore } from '../stores/classStore'
import GoogleChart from '../components/GoogleChart.vue'
import { formatKRW, todayStr, currentMonth } from '../utils/format'

const studentS = useStudentStore()
const paymentS = usePaymentStore()
const attS = useAttendanceStore()
const consS = useConsultationStore()
const mkS = useMakeupStore()
const classS = useClassStore()

onMounted(async () => {
  await Promise.all([studentS.fetchAll(), paymentS.fetchAll(), attS.fetchAll(), consS.fetchAll(), mkS.fetchAll(), classS.fetchAll()])
})

const studentName = (id) => studentS.items.find(s => s.id === id)?.name || '-'

const cards = computed(() => {
  const enrolled = studentS.items.filter(s => s.status === '재원').length
  const today = todayStr()
  const todayAtt = attS.items.filter(a => a.date === today)
  const month = currentMonth()
  const monthPays = paymentS.items.filter(p => p.month === month)
  const paidSum = monthPays.reduce((s,p) => s + (p.paidAmount||0), 0)
  const unpaidSum = monthPays.reduce((s,p) => s + (p.unpaidAmount||0), 0)
  const unpaidStudents = new Set(paymentS.items.filter(p => p.status !== '납부완료').map(p => p.studentId)).size
  const todayMakeup = mkS.items.filter(m => m.makeupDate === today && m.status === '예정').length

  return [
    { label: '전체 재원생', value: enrolled, icon: 'fa-solid fa-user-graduate', bg: 'bg-grad-primary' },
    { label: '오늘 출석', value: todayAtt.filter(a=>a.status==='출석').length, icon:'fa-solid fa-check', bg:'bg-success' },
    { label: '오늘 결석', value: todayAtt.filter(a=>a.status==='결석').length, icon:'fa-solid fa-xmark', bg:'bg-danger' },
    { label: '오늘 지각', value: todayAtt.filter(a=>a.status==='지각').length, icon:'fa-solid fa-clock', bg:'bg-warning' },
    { label: '이번 달 납부', value: formatKRW(paidSum), icon:'fa-solid fa-won-sign', bg:'bg-grad-primary' },
    { label: '이번 달 미납', value: formatKRW(unpaidSum), icon:'fa-solid fa-triangle-exclamation', bg:'bg-danger' },
    { label: '미납 학생', value: unpaidStudents + '명', icon:'fa-solid fa-user-clock', bg:'bg-warning' },
    { label: '오늘 보강', value: todayMakeup + '건', icon:'fa-solid fa-calendar-plus', bg:'bg-info' }
  ]
})

const revenueChart = computed(() => {
  const map = {}
  paymentS.items.forEach(p => { map[p.month] = (map[p.month]||0) + (p.paidAmount||0) })
  const rows = Object.entries(map).sort().map(([m,v]) => [m, v])
  return [['월','수납액'], ...rows]
})

const classChart = computed(() => {
  const map = {}
  studentS.items.forEach(s => {
    const cn = classS.items.find(c => c.id === s.classId)?.name || '미배정'
    map[cn] = (map[cn]||0) + 1
  })
  return [['반','학생 수'], ...Object.entries(map)]
})

const attChart = computed(() => {
  const types = ['출석','지각','결석','조퇴']
  const rows = types.map(t => [t, attS.items.filter(a => a.status === t).length])
  return [['상태','건수'], ...rows]
})

const unpaidChart = computed(() => {
  const map = {}
  paymentS.items.filter(p => p.status !== '납부완료').forEach(p => {
    const cn = classS.items.find(c => c.id === p.classId)?.name || '기타'
    map[cn] = (map[cn]||0) + (p.unpaidAmount||0)
  })
  return [['반','미납액'], ...Object.entries(map)]
})

const recentConsults = computed(() =>
  [...consS.items].sort((a,b) => b.consultationDate.localeCompare(a.consultationDate)).slice(0,5)
)
</script>
