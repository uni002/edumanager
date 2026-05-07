<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
      <h3 class="mb-0"><i class="fa-solid fa-user-graduate me-2 text-primary"></i>학생 관리</h3>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" @click="downloadTemplate"><i class="fa-solid fa-download me-1"></i>템플릿</button>
        <label class="btn btn-outline-success mb-0">
          <i class="fa-solid fa-file-excel me-1"></i>엑셀 업로드
          <input type="file" accept=".xlsx,.xls" hidden @change="onExcelUpload" />
        </label>
        <button class="btn btn-primary" @click="openCreate"><i class="fa-solid fa-plus me-1"></i>학생 등록</button>
      </div>
    </div>

    <div class="card p-3 mb-3">
      <div class="row g-2">
        <div class="col-md-4"><input v-model="search" class="form-control" placeholder="이름, 연락처, 보호자 검색" /></div>
        <div class="col-md-3">
          <select v-model="classFilter" class="form-select">
            <option value="">전체 반</option>
            <option v-for="c in classS.items" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div class="col-md-3">
          <select v-model="statusFilter" class="form-select">
            <option value="">전체 상태</option>
            <option>재원</option><option>휴원</option><option>퇴원</option>
          </select>
        </div>
        <div class="col-md-2">
          <select v-model="sortBy" class="form-select">
            <option value="name">이름순</option>
            <option value="registeredAt">등록일순</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="preview.length" class="card p-3 mb-3">
      <div class="d-flex justify-content-between mb-2">
        <h6 class="mb-0"><i class="fa-solid fa-eye me-1"></i>업로드 미리보기 ({{ preview.length }}명)</h6>
        <div>
          <button class="btn btn-sm btn-success me-2" @click="confirmBulk"><i class="fa-solid fa-check"></i> 일괄 등록</button>
          <button class="btn btn-sm btn-secondary" @click="preview=[]">취소</button>
        </div>
      </div>
      <div class="table-responsive" style="max-height:300px">
        <table class="table table-sm">
          <thead><tr><th>이름</th><th>성별</th><th>생년월일</th><th>연락처</th><th>보호자</th><th>반</th><th>상태</th></tr></thead>
          <tbody>
            <tr v-for="(p,i) in preview" :key="i">
              <td>{{ p.name }}</td><td>{{ p.gender }}</td><td>{{ p.birthDate }}</td>
              <td>{{ p.phone }}</td><td>{{ p.parentName }}</td><td>{{ p.classId }}</td><td>{{ p.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card p-3">
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead>
            <tr><th>#</th><th>이름</th><th>성별</th><th>반</th><th>연락처</th><th>보호자</th><th>상태</th><th></th></tr>
          </thead>
          <tbody>
            <tr v-for="s in filtered" :key="s.id">
              <td>{{ s.id }}</td>
              <td><router-link :to="`/students/${s.id}`">{{ s.name }}</router-link></td>
              <td>{{ s.gender }}</td>
              <td>{{ className(s.classId) }}</td>
              <td>{{ s.phone }}</td>
              <td>{{ s.parentPhone }}</td>
              <td><span class="badge" :class="statusClass(s.status)">{{ s.status }}</span></td>
              <td>
                <button class="btn btn-sm btn-outline-primary me-1" @click="openEdit(s)"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-sm btn-outline-danger" @click="onDelete(s.id)"><i class="fa-solid fa-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showForm" class="modal-backdrop-custom" @click.self="showForm=false">
      <div class="card p-4 m-3" style="max-width:600px;width:100%">
        <h5>{{ editing ? '학생 수정' : '학생 등록' }}</h5>
        <div class="row g-2 mt-2">
          <div class="col-6"><label class="form-label">이름</label><input v-model="form.name" class="form-control" /></div>
          <div class="col-6"><label class="form-label">성별</label>
            <select v-model="form.gender" class="form-select"><option>남</option><option>여</option></select>
          </div>
          <div class="col-6"><label class="form-label">생년월일</label><input type="date" v-model="form.birthDate" class="form-control" /></div>
          <div class="col-6"><label class="form-label">연락처</label><input v-model="form.phone" class="form-control" /></div>
          <div class="col-6"><label class="form-label">보호자명</label><input v-model="form.parentName" class="form-control" /></div>
          <div class="col-6"><label class="form-label">보호자연락처</label><input v-model="form.parentPhone" class="form-control" /></div>
          <div class="col-12"><label class="form-label">주소</label><input v-model="form.address" class="form-control" /></div>
          <div class="col-6"><label class="form-label">반</label>
            <select v-model.number="form.classId" class="form-select">
              <option v-for="c in classS.items" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div class="col-6"><label class="form-label">상태</label>
            <select v-model="form.status" class="form-select"><option>재원</option><option>휴원</option><option>퇴원</option></select>
          </div>
          <div class="col-12"><label class="form-label">메모</label><textarea v-model="form.memo" class="form-control"></textarea></div>
        </div>
        <div class="text-end mt-3">
          <button class="btn btn-secondary me-2" @click="showForm=false">취소</button>
          <button class="btn btn-primary" @click="onSave"><i class="fa-solid fa-save me-1"></i>저장</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStudentStore } from '../stores/studentStore'
import { useClassStore } from '../stores/classStore'
import { readExcelFile, mapRowToStudent, downloadTemplate } from '../utils/excel'

const studentS = useStudentStore()
const classS = useClassStore()
const search = ref(''); const classFilter = ref(''); const statusFilter = ref(''); const sortBy = ref('name')
const showForm = ref(false); const editing = ref(false)
const form = ref({})
const preview = ref([])

onMounted(() => { studentS.fetchAll(); classS.fetchAll() })

const className = (id) => classS.items.find(c => c.id === id)?.name || '-'
const statusClass = (s) => s === '재원' ? 'bg-success' : s === '휴원' ? 'bg-warning' : 'bg-secondary'

const filtered = computed(() => {
  let arr = [...studentS.items]
  if (search.value) {
    const q = search.value.toLowerCase()
    arr = arr.filter(s => [s.name,s.phone,s.parentName,s.parentPhone].some(v => (v||'').toLowerCase().includes(q)))
  }
  if (classFilter.value) arr = arr.filter(s => s.classId === Number(classFilter.value))
  if (statusFilter.value) arr = arr.filter(s => s.status === statusFilter.value)
  arr.sort((a,b) => (a[sortBy.value]||'').localeCompare(b[sortBy.value]||''))
  return arr
})

const openCreate = () => {
  editing.value = false
  form.value = { name:'',gender:'남',birthDate:'',phone:'',parentName:'',parentPhone:'',address:'',classId: classS.items[0]?.id||1, teacherId:1, status:'재원', registeredAt: new Date().toISOString().slice(0,10), memo:'' }
  showForm.value = true
}
const openEdit = (s) => { editing.value = true; form.value = { ...s }; showForm.value = true }
const onSave = async () => {
  if (editing.value) await studentS.update(form.value.id, form.value)
  else await studentS.create(form.value)
  showForm.value = false
}
const onDelete = async (id) => { if (confirm('삭제하시겠습니까?')) await studentS.remove(id) }

const onExcelUpload = async (e) => {
  const file = e.target.files[0]; if (!file) return
  const rows = await readExcelFile(file)
  preview.value = rows.map(mapRowToStudent)
  e.target.value = ''
}
const confirmBulk = async () => {
  for (const s of preview.value) await studentS.create(s)
  preview.value = []
  alert('일괄 등록 완료')
}
</script>

<style scoped>
.modal-backdrop-custom {
  position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 1050;
  display: flex; align-items: center; justify-content: center;
}
</style>
