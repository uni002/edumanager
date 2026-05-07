import * as XLSX from 'xlsx'

export const readExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const wb = XLSX.read(data, { type: 'array' })
        const sheet = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })
        resolve(rows)
      } catch (err) { reject(err) }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

// Excel row -> student object
export const mapRowToStudent = (row) => ({
  name: row['이름'] || row['name'] || '',
  gender: row['성별'] || row['gender'] || '남',
  birthDate: row['생년월일'] || row['birthDate'] || '',
  phone: row['연락처'] || row['phone'] || '',
  parentName: row['보호자명'] || row['parentName'] || '',
  parentPhone: row['보호자연락처'] || row['parentPhone'] || '',
  address: row['주소'] || row['address'] || '',
  classId: Number(row['반'] || row['classId'] || 1),
  teacherId: 1,
  status: row['상태'] || row['status'] || '재원',
  registeredAt: new Date().toISOString().slice(0,10),
  memo: row['메모'] || row['memo'] || ''
})

export const downloadTemplate = () => {
  const data = [{
    '이름':'홍길동','성별':'남','생년월일':'2010-01-01','연락처':'010-1234-5678',
    '보호자명':'홍부모','보호자연락처':'010-9999-9999','주소':'서울시',
    '반':1,'상태':'재원','메모':''
  }]
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'students')
  XLSX.writeFile(wb, 'students_template.xlsx')
}
