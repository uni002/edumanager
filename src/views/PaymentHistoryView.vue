<template>
  <div>
    <h3 class="mb-3"><i class="fa-solid fa-receipt me-2 text-primary"></i>결제 내역</h3>
    <div class="card p-3">
      <table class="table align-middle">
        <thead><tr><th>주문번호</th><th>학생</th><th>주문명</th><th>금액</th><th>수단</th><th>상태</th><th>승인일시</th><th>영수증</th></tr></thead>
        <tbody>
          <tr v-for="h in [...gw.history].reverse()" :key="h.id">
            <td><small>{{ h.orderId }}</small></td>
            <td>{{ name(h.studentId) }}</td>
            <td>{{ h.orderName }}</td>
            <td class="fw-bold">{{ formatKRW(h.amount) }}</td>
            <td>{{ h.method }}</td>
            <td><span class="badge" :class="badge(h.status)">{{ label(h.status) }}</span></td>
            <td><small>{{ h.approvedAt || '-' }}</small></td>
            <td>
              <a v-if="h.receiptUrl" :href="h.receiptUrl" target="_blank" class="btn btn-sm btn-outline-primary"><i class="fa-solid fa-receipt"></i></a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { usePaymentGatewayStore } from '../stores/paymentGatewayStore'
import { useStudentStore } from '../stores/studentStore'
import { formatKRW } from '../utils/format'

const gw = usePaymentGatewayStore(); const studentS = useStudentStore()
onMounted(() => Promise.all([gw.fetchPaymentHistory(),studentS.fetchAll()]))
const name = (id) => studentS.items.find(s => s.id === id)?.name || '-'
const badge = (s) => s==='DONE'?'bg-success':s==='FAILED'?'bg-secondary':s==='CANCELED'?'bg-warning':'bg-info'
const label = (s) => ({DONE:'결제완료',FAILED:'실패',CANCELED:'취소'}[s] || s)
</script>
