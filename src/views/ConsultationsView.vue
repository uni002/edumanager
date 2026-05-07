<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h3><i class="fa-solid fa-comments me-2 text-primary"></i>상담 이력 관리</h3>
      <button class="btn btn-primary" @click="openForm"><i class="fa-solid fa-plus"></i> 상담 등록</button>
    </div>
    <div class="card p-3 mb-3">
      <div class="row g-2">
        <div class="col-md-4"><select v-model="studentFilter" class="form-select">
          <option value="">전체 학생</option>
          <option v-for="s in studentS.items" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select></div>
        <div class="col-md-4"><select v-model="typeFilter" class="form-select">
          <option value="">전체 유형</option><option>학습</option><option>출결</option><option>생활태도</option><option>진로</option><option>수납</option>
        </select></div>
      </div>
    </div>
    <div class="card p-3">
      <table class="table"><thead><tr><th>날짜</th><th>학생</th><th>대상</th><th>유형</th><th>내용</th><th>후속조치</th></tr></thead>
        <tbody>
          <tr v-for="c in filtered" :key="c.id">
            <td>{{ c.consultationDate }}</td><td>{{ name(c.studentId) }}</td>
            <td>{{ c.target }}</td><td><span class="badge bg-info">{{ c.type }}</span></td>
            <td>{{ c.content }}</td><td>{{ c.followUp }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="show" class="modal-backdrop-custom" @click.self="show=false">
      <div class="card p-4 m-3" style="max-width:500px;width:100%">
        <h5>상담 등록</h5>
        <div class="row g-2 mt-2">
          <div class="col-12"><label>학생</label><select v-model.number="form.studentId" class="form-select">
            <option v-for="s in studentS.items" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select></div>
          <div class="col-6"><label>날짜</label><input type="date" v-model="form.consultationDate" class="form-control" /></div>
          <div class="col-6"><label>대상</label><select v-model="form.target" class="form-select"><option>학생</option><option>학부모</option></select></div>
          <div class="col-6"><label>유형</label><select v-model="form.type" class="form-select"><option>학습</option><option>출결</option><option>생활태도</option><option>진로</option><option>수납</option></select></div>
          <div class="col-12"><label>내용</label><textarea v-model="form.content" class="form-control"></textarea></div>
          <div class="col-12"><label>후속조치</label><input v-model="form.followUp" class="form-control" /></div>
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
import { useConsultationStore } from '../stores/consultationStore'
import { useStudentStore } from '../stores/studentStore'

const consS = useConsultationStore(); const studentS = useStudentStore()
const studentFilter = ref(''); const typeFilter = ref('')
const show = ref(false); const form = ref({})
onMounted(() => Promise.all([consS.fetchAll(),studentS.fetchAll()]))
const name = (id) => studentS.items.find(s => s.id === id)?.name || '-'
const filtered = computed(() => consS.items.filter(c =>
  (!studentFilter.value || c.studentId === Number(studentFilter.value)) &&
  (!typeFilter.value || c.type === typeFilter.value)
))
const openForm = () => {
  form.value = { studentId: studentS.items[0]?.id, teacherId: 1, consultationDate: new Date().toISOString().slice(0,10), target:'학생', type:'학습', content:'', followUp:'', memo:'' }
  show.value = true
}
const save = async () => { await consS.create(form.value); show.value = false }
</script>
<style scoped>
.modal-backdrop-custom { position: fixed; inset:0; background: rgba(0,0,0,.4); z-index:1050; display:flex; align-items:center; justify-content:center; }
</style>
