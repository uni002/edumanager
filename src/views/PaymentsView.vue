<template>
  <div>
    <h3 class="mb-3"><i class="fa-solid fa-credit-card me-2 text-primary"></i>학원비 납부 관리</h3>
    <div class="card p-3 mb-3">
      <div class="row g-2">
        <div class="col-md-3"><input v-model="month" type="month" class="form-control" /></div>
        <div class="col-md-3"><select v-model="classFilter" class="form-select">
          <option value="">전체 반</option>
          <option v-for="c in classS.items" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select></div>
        <div class="col-md-3"><select v-model="statusFilter" class="form-select">
          <option value="">전체 상태</option><option>납부완료</option><option>부분납부</option><option>미납</option>
        </select></div>
        <div class="col-md-3 form-check d-flex align-items-center">
          <input class="form-check-input me-2" type="checkbox" v-model="onlyUnpaid" id="ou"/>
          <label for="ou" class="form-check-label">미납자만 보기</label>
        </div>
      </div>
    </div>

    <div class="card p-3">
      <table class="table align-middle">
        <thead><tr><th>학생</th><th>반</th><th>월</th><th>수강료</th><th>납부</th><th>미납</th><th>상태</th><th>결제수단</th><th></th></tr></thead>
        <tbody>
          <tr v-for="p in filtered" :key="p.id">
            <td>{{ studentName(p.studentId) }}</td>
            <td>{{ className(p.classId) }}</td>
            <td>{{ p.month }}</td>
            <td>{{ formatKRW(p.tuitionFee) }}</td>
            <td>{{ formatKRW(p.paidAmount) }}</td>
            <td class="text-danger">{{ formatKRW(p.unpaidAmount) }}</td>
            <td><span class="badge" :class="badgeClass(p.status)">{{ p.status }}</span></td>
            <td>{{ p.paymentMethod || '-' }}</td>
            <td>
              <router-link v-if="p.status !== '납부완료'" :to="`/payments/checkout/${p.id}`" class="btn btn-sm btn-primary">
                <i class="fa-solid fa-credit-card"></i> 결제하기
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePaymentStore } from '../stores/paymentStore'
import { useStudentStore } from '../stores/studentStore'
import { useClassStore } from '../stores/classStore'
import { formatKRW, currentMonth } from '../utils/format'

const payS = usePaymentStore(); const studentS = useStudentStore(); const classS = useClassStore()
const month = ref(currentMonth()); const classFilter = ref(''); const statusFilter = ref(''); const onlyUnpaid = ref(false)

onMounted(() => Promise.all([payS.fetchAll(),studentS.fetchAll(),classS.fetchAll()]))

const studentName = (id) => studentS.items.find(s => s.id === id)?.name || '-'
const className = (id) => classS.items.find(c => c.id === id)?.name || '-'
const badgeClass = (s) => s === '납부완료' ? 'bg-success' : s === '부분납부' ? 'bg-warning' : s === '미납' ? 'bg-danger' : 'bg-secondary'

const filtered = computed(() => {
  let arr = [...payS.items]
  if (month.value) arr = arr.filter(p => p.month === month.value)
  if (classFilter.value) arr = arr.filter(p => p.classId === Number(classFilter.value))
  if (statusFilter.value) arr = arr.filter(p => p.status === statusFilter.value)
  if (onlyUnpaid.value) arr = arr.filter(p => p.status !== '납부완료')
  return arr
})
</script>
