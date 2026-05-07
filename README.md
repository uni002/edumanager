# EduClass Manager

Vue3 기반 학원 학생관리 웹사이트입니다. 실제 학원 운영에서 사용할 수 있는 학생/출결/납부/상담/보강/결제 관리 기능을 모두 제공합니다.

## 사용 기술
- Vue 3 (Composition API), JavaScript ES6
- Vue Router, Pinia
- Axios, json-server
- Bootstrap 5, Font Awesome
- Google Charts
- xlsx (엑셀 일괄 업로드)

## 설치 및 실행
```bash
npm install
npm run start   # vite + json-server 동시 실행
```
- 프론트엔드: http://localhost:5173
- json-server: http://localhost:3000

개별 실행:
```bash
npm run server  # json-server (포트 3000)
npm run dev     # vite (포트 5173)
```

## 주요 기능
1. **대시보드** — 재원생/출결/납부/미납/보강 KPI 카드, Google Charts 4종(LineChart, PieChart, ColumnChart, BarChart), 최근 상담 이력
2. **학생 관리** — 등록/수정/삭제, 검색·필터·정렬, **엑셀 일괄 업로드(미리보기 포함)**
3. **학생 상세** — 기본정보 + 출결/납부/상담/보강 이력 탭
4. **출결 관리** — 날짜·반별 출석 체크, 오늘 요약 뱃지
5. **학원비 납부 관리** — 월/반/상태 필터, 미납자만 보기, 결제하기 버튼
6. **미납 관리** — 미납 학생 목록, 총 미납 합계, 빠른 납부 처리
7. **상담 이력** — 학생/유형 필터, 상담 등록
8. **보강 수업** — 보강 등록, 오늘 보강 요약, 완료 처리
9. **반/강사 관리** — CRUD
10. **결제 시스템** — Toss Payments / PortOne 호환 구조 (mock)

## 폴더 구조
```
src/
  assets/main.css
  components/GoogleChart.vue
  views/  (DashboardView, StudentsView, StudentDetailView, AttendanceView,
           PaymentsView, UnpaidView, ConsultationsView, MakeupClassesView,
           ClassesView, CheckoutView, PaymentSuccessView, PaymentFailView,
           PaymentHistoryView)
  router/index.js
  stores/ (studentStore, attendanceStore, paymentStore, consultationStore,
           makeupStore, classStore, teacherStore, paymentGatewayStore)
  services/api.js
  utils/  (excel.js, format.js)
  App.vue, main.js
db.json
```

## 샘플 데이터
- students 120명, classes 9개, teachers 7명
- attendance 280건, payments 140건
- consultations 60건, makeupClasses 40건
- paymentsHistory 100건+

## 결제 시스템 안내

### 테스트 결제 모드
- `paymentGatewayStore.requestPayment()`는 **mock 결제** 처리이며, json-server에 결제 이력만 기록합니다.
- 5% 확률로 실패를 시뮬레이션해 결제 실패 화면도 확인 가능합니다.
- 부분 결제를 지원합니다 (미납 금액 범위 내).

### Toss Payments / PortOne 연동 방식
- 프론트엔드에서는 **client key**만 사용합니다 (`paymentGatewayStore.js`의 `TOSS_CLIENT_KEY` 참고).
- 실제 운영에서는 다음 흐름으로 연동합니다:
  1. 프론트: `window.TossPayments(clientKey).requestPayment({...})` 호출
  2. 결제창 → 사용자 인증 → 성공 시 `successUrl`로 리다이렉트
  3. **백엔드(Node.js/Express 등)**: secret key로 `/v1/payments/confirm` API 호출하여 승인
  4. DB에 결제 결과 기록 → 프론트에 응답

### 보안 주의사항
- secret key는 절대 프론트엔드에 두지 마세요.
- 결제 승인 API는 반드시 백엔드에서 호출해야 합니다.
- json-server는 데모용입니다. 실제 운영 시 Node.js/Express, NestJS 등 백엔드 서버가 필요합니다.

## 5일 개발 일정
- **1일차**: 요구사항 정리, DB 구조 설계, 화면 설계
- **2일차**: Vue 프로젝트 구조, 라우터, Pinia, json-server 연동
- **3일차**: 학생 관리, 엑셀 업로드, 출결 관리 구현
- **4일차**: 학원비 납부, 미납, 상담, 보강 관리 구현
- **5일차**: 대시보드, Google Charts, UI 개선, 테스트, 발표 준비
