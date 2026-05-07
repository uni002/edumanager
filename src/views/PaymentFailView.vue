<template>
  <div class="text-center py-5">
    <i class="fa-solid fa-circle-xmark text-danger" style="font-size:5rem"></i>
    <h2 class="mt-3">결제에 실패했습니다</h2>
    <p class="text-muted">{{ reason || '알 수 없는 오류가 발생했습니다.' }}</p>
    <div class="mt-4">
      <router-link to="/payments" class="btn btn-outline-secondary me-2"><i class="fa-solid fa-arrow-left"></i> 납부 관리로</router-link>
      <button class="btn btn-primary" @click="$router.go(-1)"><i class="fa-solid fa-rotate-right"></i> 다시 결제하기</button>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { usePaymentGatewayStore } from '../stores/paymentGatewayStore'
const gw = usePaymentGatewayStore()
const reason = computed(() => gw.lastResult?.reason)
</script>
