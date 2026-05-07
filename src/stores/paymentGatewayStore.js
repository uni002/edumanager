import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

// IMPORTANT: Toss Payments / PortOne client key only.
// 실제 결제 승인(secret key 사용)은 반드시 백엔드 서버에서 처리해야 합니다.
// json-server 환경에서는 mock 결제로만 동작합니다.
const TOSS_CLIENT_KEY = 'test_ck_docs_Ovk5rk1EwkEbP0W43n07xlzm'

export const usePaymentGatewayStore = defineStore('paymentGateway', () => {
  const history = ref([])
  const loading = ref(false)
  const lastResult = ref(null)

  const fetchPaymentHistory = async () => {
    loading.value = true
    try { const { data } = await api.get('/paymentsHistory'); history.value = data }
    finally { loading.value = false }
  }

  // 실제로는 window.TossPayments(clientKey).requestPayment(...) 호출
  // 여기서는 mock 처리
  const requestPayment = async ({ paymentId, studentId, amount, orderName, method }) => {
    const orderId = 'ORD-' + Date.now()
    // 실패 시뮬레이션 5%
    if (Math.random() < 0.05) {
      return await handlePaymentFail({ paymentId, studentId, amount, orderName, method, orderId, reason: '카드 한도 초과 (mock)' })
    }
    return await confirmMockPayment({ paymentId, studentId, amount, orderName, method, orderId })
  }

  const confirmMockPayment = async ({ paymentId, studentId, amount, orderName, method, orderId }) => {
    const now = new Date().toISOString()
    const record = {
      paymentId, studentId, orderId, orderName, amount, method,
      status: 'DONE',
      approvedAt: now,
      receiptUrl: `https://mock.receipt/${orderId}`,
      failReason: '',
      createdAt: now
    }
    const { data } = await api.post('/paymentsHistory', record)
    history.value.push(data)
    await handlePaymentSuccess({ paymentId, amount })
    lastResult.value = { ok: true, data }
    return data
  }

  const handlePaymentSuccess = async ({ paymentId, amount }) => {
    const { data: p } = await api.get(`/payments/${paymentId}`)
    const newPaid = (p.paidAmount || 0) + amount
    const unpaid = Math.max(0, p.tuitionFee - newPaid)
    const status = unpaid === 0 ? '납부완료' : '부분납부'
    await api.put(`/payments/${paymentId}`, {
      ...p, paidAmount: newPaid, unpaidAmount: unpaid, status,
      paymentDate: new Date().toISOString().slice(0,10)
    })
  }

  const handlePaymentFail = async ({ paymentId, studentId, amount, orderName, method, orderId, reason }) => {
    const now = new Date().toISOString()
    const record = {
      paymentId, studentId, orderId, orderName, amount, method,
      status: 'FAILED', approvedAt: '', receiptUrl: '',
      failReason: reason, createdAt: now
    }
    const { data } = await api.post('/paymentsHistory', record)
    history.value.push(data)
    lastResult.value = { ok: false, data, reason }
    return { ok: false, reason, data }
  }

  const cancelPaymentMock = async (historyId) => {
    const { data: h } = await api.get(`/paymentsHistory/${historyId}`)
    await api.put(`/paymentsHistory/${historyId}`, { ...h, status: 'CANCELED' })
    await fetchPaymentHistory()
  }

  return {
    history, loading, lastResult, TOSS_CLIENT_KEY,
    fetchPaymentHistory, requestPayment, confirmMockPayment,
    handlePaymentSuccess, handlePaymentFail, cancelPaymentMock
  }
})
