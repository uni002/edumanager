<template>
  <div class="text-center py-5">
    <i class="fa-solid fa-circle-check text-success" style="font-size:5rem"></i>
    <h2 class="mt-3">결제가 완료되었습니다</h2>
    <div v-if="data" class="card p-4 mx-auto mt-4" style="max-width:500px;text-align:left">
      <div class="row mb-2"><div class="col-5 text-muted">결제 번호</div><div class="col">{{ data.orderId }}</div></div>
      <div class="row mb-2"><div class="col-5 text-muted">주문명</div><div class="col">{{ data.orderName }}</div></div>
      <div class="row mb-2"><div class="col-5 text-muted">결제 금액</div><div class="col fw-bold">{{ formatKRW(data.amount) }}</div></div>
      <div class="row mb-2"><div class="col-5 text-muted">결제 수단</div><div class="col">{{ data.method }}</div></div>
      <div class="row"><div class="col-5 text-muted">결제 일시</div><div class="col">{{ data.approvedAt }}</div></div>
    </div>
    <div class="mt-4">
      <router-link to="/payments" class="btn btn-primary me-2">납부 관리로</router-link>
      <router-link to="/payment-history" class="btn btn-outline-secondary">결제 내역 보기</router-link>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { usePaymentGatewayStore } from '../stores/paymentGatewayStore'
import { formatKRW } from '../utils/format'
const gw = usePaymentGatewayStore()
const data = computed(() => gw.lastResult?.data)
</script>
