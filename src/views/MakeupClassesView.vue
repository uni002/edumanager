<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h3><i class="fa-solid fa-calendar-plus me-2 text-primary"></i>보강 수업 관리</h3>
      <button class="btn btn-primary" @click="openForm"><i class="fa-solid fa-plus"></i> 보강 등록</button>
    </div>
    <div class="card p-3 mb-3">
      <div class="row g-2">
        <div class="col-md-4"><select v-model="statusFilter" class="form-select">
          <option value="">전체</option><option>예정</option><option>완료</option><option>취소</option>
        </select></div>
      </div>
    </div>
    <div class="alert alert-info">오늘 보강 예정: <strong>{{ todayCount }}건</strong></div>
    <div class="card p-3">
      <table class="table"><thead><tr><th>학생</th><th>원수업일</th><th>보강일</th><th>시간</th><th>사유</th><th>상태</th><th></th></tr></thead>
        <tbody>
          <tr v-for="m in filtered" :key="m.id">
            <td>{{ name(m.studentId) }}</td><td>{{ m.originalDate }}</td>
            <td>{{ m.makeupDate }}</td><td>{{ m.makeupTime }}</td>
            <td>{{ m.reason }}</td>
            <td><span class="badge" :class="badge(m.status)">{{ m.status }}</span></td>
            <td><button v-if="m.status==='예정'" class="btn btn-sm btn-success" @click="complete(m)"><i class="fa-solid fa-check"></i> 완료</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="show" class="modal-backdrop-custom" @click.self="show=false">
      <div class="card p-4 m-3" style="max-width:500px;width:100%">
        <h5>보강 등록</h5>
        <div class="row g-2 mt-2">
          <div class="col-12"><label>학생</label><select v-model.number="form.studentId" class="form-select">
            <option v-for="s in studentS.items" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select></div>
          <div class="col-6"><label>원수업일</label><input type="date" v-model="form.originalDate" class="form-control"/></div>
          <div class="col-6"><label>보강일</label><input type="date" v-model="form.makeupDate" class="form-control"/></div>
          <div class="col-6"><label>보강 시간</label><input v-model="form.makeupTime" class="form-control" placeholder="19:00"/></div>
          <div class="col-6"><label>사유</label><input v-model="form.reason" class="form-control"/></div>
        </div>
        <div class="text-end mt-3">
          <button class="btn btn-secondary me-2" @click="show=false">취소</button>
          <button class="btn btn-primary" @click="save"><i class="fa-solid fa-save"></i> 저장</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMakeupStore } from '../stores/makeupStore'
import { useStudentStore } from '../stores/studentStore'
import { todayStr } from '../utils/format'

const mkS = useMakeupStore(); const studentS = useStudentStore()
const statusFilter = ref(''); const show = ref(false); const form = ref({})
onMounted(() => Promise.all([mkS.fetchAll(),studentS.fetchAll()]))
const name = (id) => studentS.items.find(s => s.id === id)?.name || '-'
const badge = (s) => s==='완료'?'bg-success':s==='취소'?'bg-secondary':'bg-warning'
const filtered = computed(() => mkS.items.filter(m => !statusFilter.value || m.status === statusFilter.value))
const todayCount = computed(() => mkS.items.filter(m => m.makeupDate === todayStr() && m.status === '예정').length)
const openForm = () => { form.value = { studentId: studentS.items[0]?.id, classId:1, teacherId:1, originalDate:'', makeupDate:'', makeupTime:'', reason:'', status:'예정', memo:'' }; show.value=true }
const save = async () => { await mkS.create(form.value); show.value=false }
const complete = async (m) => { await mkS.update(m.id, { ...m, status: '완료' }) }
</script>
<style scoped>
.modal-backdrop-custom { position: fixed; inset:0; background: rgba(0,0,0,.4); z-index:1050; display:flex; align-items:center; justify-content:center; }
</style>
