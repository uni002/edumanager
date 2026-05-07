<template>
  <div v-if="student">
    <router-link to="/students" class="btn btn-link mb-2"><i class="fa-solid fa-arrow-left"></i> 목록</router-link>
    <div class="card p-4 mb-3">
      <div class="d-flex align-items-center gap-3">
        <div class="icon-box bg-grad-primary" style="width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:1.6rem"><i class="fa-solid fa-user"></i></div>
        <div>
          <h4 class="mb-0">{{ student.name }} <span class="badge bg-success ms-2">{{ student.status }}</span></h4>
          <div class="text-muted">{{ className(student.classId) }} · {{ student.gender }} · {{ student.birthDate }}</div>
        </div>
      </div>
      <hr/>
      <div class="row">
        <div class="col-md-6"><strong>연락처:</strong> {{ student.phone }}</div>
        <div class="col-md-6"><strong>보호자:</strong> {{ student.parentName }} ({{ student.parentPhone }})</div>
        <div class="col-md-6 mt-2"><strong>주소:</strong> {{ student.address }}</div>
        <div class="col-md-6 mt-2"><strong>등록일:</strong> {{ student.registeredAt }}</div>
        <div class="col-12 mt-2"><strong>메모:</strong> {{ student.memo || '-' }}</div>
      </div>
    </div>

    <ul class="nav nav-tabs">
      <li class="nav-item" v-for="t in tabs" :key="t">
        <a class="nav-link" :class="{active:tab===t}" href="#" @click.prevent="tab=t">{{ t }}</a>
      </li>
    </ul>
    <div class="card p-3 border-top-0">
      <div v-if="tab==='출결 이력'">
        <table class="table table-sm"><thead><tr><th>날짜</th><th>상태</th><th>메모</th></tr></thead>
          <tbody><tr v-for="a in myAtt" :key="a.id"><td>{{ a.date }}</td><td><span class="badge bg-info">{{ a.status }}</span></td><td>{{ a.memo }}</td></tr></tbody>
        </table>
      </div>
      <div v-if="tab==='납부 이력'">
        <table class="table table-sm"><thead><tr><th>월</th><th>금액</th><th>납부</th><th>상태</th></tr></thead>
          <tbody><tr v-for="p in myPay" :key="p.id"><td>{{ p.month }}</td><td>{{ formatKRW(p.tuitionFee) }}</td><td>{{ formatKRW(p.paidAmount) }}</td><td>{{ p.status }}</td></tr></tbody>
        </table>
      </div>
      <div v-if="tab==='상담 이력'">
        <table class="table table-sm"><thead><tr><th>날짜</th><th>유형</th><th>대상</th><th>내용</th></tr></thead>
          <tbody><tr v-for="c in myCons" :key="c.id"><td>{{ c.consultationDate }}</td><td>{{ c.type }}</td><td>{{ c.target }}</td><td>{{ c.content }}</td></tr></tbody>
        </table>
      </div>
      <div v-if="tab==='보강 이력'">
        <table class="table table-sm"><thead><tr><th>원수업일</th><th>보강일</th><th>시간</th><th>상태</th></tr></thead>
          <tbody><tr v-for="m in myMk" :key="m.id"><td>{{ m.originalDate }}</td><td>{{ m.makeupDate }}</td><td>{{ m.makeupTime }}</td><td>{{ m.status }}</td></tr></tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStudentStore } from '../stores/studentStore'
import { useClassStore } from '../stores/classStore'
import { useAttendanceStore } from '../stores/attendanceStore'
import { usePaymentStore } from '../stores/paymentStore'
import { useConsultationStore } from '../stores/consultationStore'
import { useMakeupStore } from '../stores/makeupStore'
import { formatKRW } from '../utils/format'

const route = useRoute()
const id = computed(() => Number(route.params.id))
const studentS = useStudentStore(); const classS = useClassStore()
const attS = useAttendanceStore(); const payS = usePaymentStore()
const consS = useConsultationStore(); const mkS = useMakeupStore()

onMounted(() => Promise.all([studentS.fetchAll(),classS.fetchAll(),attS.fetchAll(),payS.fetchAll(),consS.fetchAll(),mkS.fetchAll()]))

const student = computed(() => studentS.items.find(s => s.id === id.value))
const className = (cid) => classS.items.find(c => c.id === cid)?.name || '-'
const myAtt = computed(() => attS.items.filter(a => a.studentId === id.value))
const myPay = computed(() => payS.items.filter(p => p.studentId === id.value))
const myCons = computed(() => consS.items.filter(c => c.studentId === id.value))
const myMk = computed(() => mkS.items.filter(m => m.studentId === id.value))

const tabs = ['출결 이력','납부 이력','상담 이력','보강 이력']
const tab = ref('출결 이력')
</script>
