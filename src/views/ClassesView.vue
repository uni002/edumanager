<template>
  <div>
    <h3 class="mb-3"><i class="fa-solid fa-chalkboard-user me-2 text-primary"></i>반/강사 관리</h3>

    <ul class="nav nav-tabs mb-3">
      <li class="nav-item"><a class="nav-link" :class="{active:tab==='classes'}" href="#" @click.prevent="tab='classes'">반</a></li>
      <li class="nav-item"><a class="nav-link" :class="{active:tab==='teachers'}" href="#" @click.prevent="tab='teachers'">강사</a></li>
    </ul>

    <div v-if="tab==='classes'">
      <div class="d-flex justify-content-end mb-2"><button class="btn btn-primary" @click="openClassForm()"><i class="fa-solid fa-plus"></i> 반 등록</button></div>
      <div class="card p-3"><table class="table align-middle">
        <thead><tr><th>반</th><th>담당</th><th>요일</th><th>시간</th><th>강의실</th><th>정원</th><th>현재</th><th></th></tr></thead>
        <tbody>
          <tr v-for="c in classS.items" :key="c.id">
            <td>{{ c.name }}</td><td>{{ teacherName(c.teacherId) }}</td>
            <td>{{ c.days }}</td><td>{{ c.startTime }}~{{ c.endTime }}</td>
            <td>{{ c.room }}</td><td>{{ c.capacity }}</td>
            <td>{{ countIn(c.id) }}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-1" @click="openClassForm(c)"><i class="fa-solid fa-pen"></i></button>
              <button class="btn btn-sm btn-outline-danger" @click="classS.remove(c.id)"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
        </tbody></table></div>
    </div>

    <div v-if="tab==='teachers'">
      <div class="d-flex justify-content-end mb-2"><button class="btn btn-primary" @click="openTeacherForm()"><i class="fa-solid fa-plus"></i> 강사 등록</button></div>
      <div class="card p-3"><table class="table align-middle">
        <thead><tr><th>이름</th><th>과목</th><th>연락처</th><th></th></tr></thead>
        <tbody>
          <tr v-for="t in teacherS.items" :key="t.id">
            <td>{{ t.name }}</td><td>{{ t.subject }}</td><td>{{ t.phone }}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-1" @click="openTeacherForm(t)"><i class="fa-solid fa-pen"></i></button>
              <button class="btn btn-sm btn-outline-danger" @click="teacherS.remove(t.id)"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
        </tbody></table></div>
    </div>

    <div v-if="showC" class="modal-backdrop-custom" @click.self="showC=false">
      <div class="card p-4 m-3" style="max-width:500px;width:100%">
        <h5>{{ formC.id?'반 수정':'반 등록' }}</h5>
        <div class="row g-2 mt-2">
          <div class="col-12"><label>반 이름</label><input v-model="formC.name" class="form-control"/></div>
          <div class="col-6"><label>담당 강사</label><select v-model.number="formC.teacherId" class="form-select"><option v-for="t in teacherS.items" :key="t.id" :value="t.id">{{ t.name }}</option></select></div>
          <div class="col-6"><label>요일</label><input v-model="formC.days" class="form-control" placeholder="월수금"/></div>
          <div class="col-4"><label>시작</label><input v-model="formC.startTime" class="form-control"/></div>
          <div class="col-4"><label>종료</label><input v-model="formC.endTime" class="form-control"/></div>
          <div class="col-4"><label>정원</label><input type="number" v-model.number="formC.capacity" class="form-control"/></div>
          <div class="col-12"><label>강의실</label><input v-model="formC.room" class="form-control"/></div>
        </div>
        <div class="text-end mt-3">
          <button class="btn btn-secondary me-2" @click="showC=false">취소</button>
          <button class="btn btn-primary" @click="saveClass">저장</button>
        </div>
      </div>
    </div>

    <div v-if="showT" class="modal-backdrop-custom" @click.self="showT=false">
      <div class="card p-4 m-3" style="max-width:400px;width:100%">
        <h5>{{ formT.id?'강사 수정':'강사 등록' }}</h5>
        <div class="row g-2 mt-2">
          <div class="col-12"><label>이름</label><input v-model="formT.name" class="form-control"/></div>
          <div class="col-12"><label>과목</label><input v-model="formT.subject" class="form-control"/></div>
          <div class="col-12"><label>연락처</label><input v-model="formT.phone" class="form-control"/></div>
        </div>
        <div class="text-end mt-3">
          <button class="btn btn-secondary me-2" @click="showT=false">취소</button>
          <button class="btn btn-primary" @click="saveTeacher">저장</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useClassStore } from '../stores/classStore'
import { useTeacherStore } from '../stores/teacherStore'
import { useStudentStore } from '../stores/studentStore'

const classS = useClassStore(); const teacherS = useTeacherStore(); const studentS = useStudentStore()
const tab = ref('classes')
const showC = ref(false); const formC = ref({})
const showT = ref(false); const formT = ref({})

onMounted(() => Promise.all([classS.fetchAll(),teacherS.fetchAll(),studentS.fetchAll()]))
const teacherName = (id) => teacherS.items.find(t => t.id === id)?.name || '-'
const countIn = (cid) => studentS.items.filter(s => s.classId === cid && s.status === '재원').length
const openClassForm = (c) => { formC.value = c ? { ...c } : { name:'',teacherId:teacherS.items[0]?.id,days:'',startTime:'',endTime:'',capacity:20,room:'' }; showC.value = true }
const saveClass = async () => { formC.value.id ? await classS.update(formC.value.id, formC.value) : await classS.create(formC.value); showC.value=false }
const openTeacherForm = (t) => { formT.value = t ? { ...t } : { name:'',subject:'',phone:'',memo:'' }; showT.value = true }
const saveTeacher = async () => { formT.value.id ? await teacherS.update(formT.value.id, formT.value) : await teacherS.create(formT.value); showT.value=false }
</script>
<style scoped>
.modal-backdrop-custom { position: fixed; inset:0; background: rgba(0,0,0,.4); z-index:1050; display:flex; align-items:center; justify-content:center; }
</style>
