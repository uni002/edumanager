import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useTeacherStore = defineStore('teachers', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchAll = async () => {
    loading.value = true; error.value = null
    try { const { data } = await api.get('/teachers'); items.value = data }
    catch (e) { error.value = e.message } finally { loading.value = false }
  }
  const create = async (payload) => {
    const { data } = await api.post('/teachers', payload)
    items.value.push(data); return data
  }
  const update = async (id, payload) => {
    const { data } = await api.put(`/teachers/${id}`, payload)
    const idx = items.value.findIndex(i => i.id === id)
    if (idx !== -1) items.value[idx] = data
    return data
  }
  const remove = async (id) => {
    await api.delete(`/teachers/${id}`)
    items.value = items.value.filter(i => i.id !== id)
  }

  return { items, loading, error, fetchAll, create, update, remove }
})
