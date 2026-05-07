<template>
  <div>
    <h3 class="mb-3"><i class="fa-solid fa-triangle-exclamation me-2 text-danger"></i>미납 관리</h3>
    <div class="alert alert-danger">총 미납 금액: <strong>{{ formatKRW(payS.totalUnpaid) }}</strong></div>
    <div class="card p-3">
      <table class="table align-middle">
        <thead><tr><th>학생</th><th>반</th><th>보호자</th><th>미납 월</th><th>미납액</th><th>최근납부</th><th>상태</th><th></th></tr></thead>
        <tbody>
          <tr v-for="p in payS.unpaid" :key="p.id">
            <td>{{ studentName(p.studentId) }}</td>
            <td>{{ className(p.classId) }}</td>
            <td>{{ parent(p.studentId) }}</td>
            <td>{{ p.month }}</td>
            <td class="text-danger fw-bold">{{ formatKRW(p.unpaidAmount) }}</td>
            <td>{{ p.paymentDate || '-' }}</td>
            <td><span class="badge" :class="p.status==='부분납부'?'bg-warning':'bg-danger'">{{ p.status }}</span></td>
            <td><router-link :to="`/payments/checkout/${p.id}`" class="btn btn-sm btn-primary"><i class="fa-solid fa-won-sign"></i> 납부 처리</router-link></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePaymentStore } from '../stores/paymentStore'
import { useStudentStore } from '../stores/studentStore'
import { useClassStore } from '../stores/classStore'
import { formatKRW } from '../utils/format'

const payS = usePaymentStore(); const studentS = useStudentStore(); const classS = useClassStore()
onMounted(() => Promise.all([payS.fetchAll(),studentS.fetchAll(),classS.fetchAll()]))
const studentName = (id) => studentS.items.find(s => s.id === id)?.name || '-'
const parent = (id) => studentS.items.find(s => s.id === id)?.parentPhone || '-'
const className = (id) => classS.items.find(c => c.id === id)?.name || '-'
</script>
