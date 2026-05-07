import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const usePaymentStore = defineStore('payments', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchAll = async () => {
    loading.value = true; error.value = null
    try { const { data } = await api.get('/payments'); items.value = data }
    catch (e) { error.value = e.message } finally { loading.value = false }
  }
  const create = async (p) => { const { data } = await api.post('/payments', p); items.value.push(data); return data }
  const update = async (id, p) => {
    const { data } = await api.put(`/payments/${id}`, p)
    const idx = items.value.findIndex(i => i.id === id)
    if (idx !== -1) items.value[idx] = data
    return data
  }
  const remove = async (id) => { await api.delete(`/payments/${id}`); items.value = items.value.filter(i => i.id !== id) }

  const unpaid = computed(() => items.value.filter(p => p.status !== '납부완료'))
  const totalUnpaid = computed(() => unpaid.value.reduce((s,p) => s + (p.unpaidAmount||0), 0))

  return { items, loading, error, fetchAll, create, update, remove, unpaid, totalUnpaid }
})
