<template>
  <div v-if="payment">
    <h3 class="mb-3"><i class="fa-solid fa-credit-card me-2 text-primary"></i>결제하기</h3>
    <div class="card p-4" style="max-width:600px">
      <h5>{{ studentName }} <small class="text-muted">{{ className }}</small></h5>
      <hr/>
      <div class="row mb-2"><div class="col-5 text-muted">납부 월</div><div class="col">{{ payment.month }}</div></div>
      <div class="row mb-2"><div class="col-5 text-muted">총 수강료</div><div class="col">{{ formatKRW(payment.tuitionFee) }}</div></div>
      <div class="row mb-2"><div class="col-5 text-muted">기존 납부</div><div class="col">{{ formatKRW(payment.paidAmount) }}</div></div>
      <div class="row mb-3"><div class="col-5 text-muted">미납 금액</div><div class="col text-danger fw-bold">{{ formatKRW(payment.unpaidAmount) }}</div></div>
      <div class="mb-3">
        <label class="form-label">결제 금액</label>
        <input type="number" v-model.number="amount" class="form-control" :max="payment.unpaidAmount" />
        <small class="text-muted">부분 결제 가능 (최대 {{ formatKRW(payment.unpaidAmount) }})</small>
      </div>
      <div class="mb-3">
        <label class="form-label">결제 수단</label>
        <select v-model="method" class="form-select">
          <option>카드</option><option>계좌이체</option><option>현금</option>
        </select>
      </div>
      <button class="btn btn-primary btn-lg" @click="pay" :disabled="!amount || amount<=0 || loading">
        <i class="fa-solid fa-lock me-2"></i>{{ loading ? '결제 중...' : `${formatKRW(amount)} 결제하기` }}
      </button>
      <div class="text-muted small mt-3">
        * 테스트 결제 모드 (json-server mock). 실제 운영 시 Toss Payments / PortOne의 client key로 결제창을 열고,
        결제 승인은 반드시 백엔드에서 secret key로 처리해야 합니다.
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePaymentStore } from '../stores/paymentStore'
import { useStudentStore } from '../stores/studentStore'
import { useClassStore } from '../stores/classStore'
import { usePaymentGatewayStore } from '../stores/paymentGatewayStore'
import { formatKRW } from '../utils/format'

const route = useRoute(); const router = useRouter()
const payS = usePaymentStore(); const studentS = useStudentStore()
const classS = useClassStore(); const gw = usePaymentGatewayStore()

const amount = ref(0); const method = ref('카드'); const loading = ref(false)

onMounted(async () => {
  await Promise.all([payS.fetchAll(),studentS.fetchAll(),classS.fetchAll()])
  if (payment.value) amount.value = payment.value.unpaidAmount
})

const payment = computed(() => payS.items.find(p => p.id === Number(route.params.paymentId)))
const studentName = computed(() => studentS.items.find(s => s.id === payment.value?.studentId)?.name || '-')
const className = computed(() => classS.items.find(c => c.id === payment.value?.classId)?.name || '-')

const pay = async () => {
  loading.value = true
  const result = await gw.requestPayment({
    paymentId: payment.value.id,
    studentId: payment.value.studentId,
    amount: amount.value,
    orderName: `${payment.value.month} 수강료 - ${studentName.value} (${className.value})`,
    method: method.value
  })
  loading.value = false
  if (result?.status === 'FAILED' || result?.ok === false) router.push('/payments/fail')
  else router.push('/payments/success')
}
</script>
