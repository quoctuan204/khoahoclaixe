import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'

const AdminSchedule = () => {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDay, setSelectedDay] = useState(today)
  const [view, setView] = useState('month') // 'month' | 'day'
  const [events, setEvents] = useState([])
  
  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [showDayEventsModal, setShowDayEventsModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    studentName: '',
    date: today.toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '10:00',
    type: 'Thực hành Sa hình',
    note: ''
  })

  // Khởi tạo dữ liệu mẫu hoặc lấy từ LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('admin_schedules')
    if (saved) {
      setEvents(JSON.parse(saved))
    } else {
      const dummyData = [
        { id: '1', title: 'Chạy DAT 810km', studentName: 'Nguyễn Văn A', date: today.toISOString().split('T')[0], startTime: '08:00', endTime: '11:00', type: 'Thực hành đường trường (DAT)', note: '' },
        { id: '2', title: 'Tập sa hình B2', studentName: 'Trần Thị B', date: today.toISOString().split('T')[0], startTime: '14:00', endTime: '16:00', type: 'Thực hành Sa hình', note: 'Kèm dốc cầu' }
      ]
      setEvents(dummyData)
      localStorage.setItem('admin_schedules', JSON.stringify(dummyData))
    }
  }, [])

  const saveEvents = (newEvents) => {
    setEvents(newEvents)
    localStorage.setItem('admin_schedules', JSON.stringify(newEvents))
  }

  // Tính toán lịch theo tháng
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayIndex = new Date(year, month, 1).getDay() // 0 (CN) -> 6 (T7)
  
  const blanks = Array(firstDayIndex).fill(null)
  const days = Array.from({length: daysInMonth}, (_, i) => i + 1)

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const handleToday = () => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelectedDay(today)
    setView('month')
  }

  // Hàm tiện ích
  const getTypeStyles = (type) => {
    switch(type) {
      case 'Thực hành đường trường (DAT)': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Thực hành Sa hình': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Lý thuyết / Mô phỏng': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }
  const getTypeBorder = (type) => {
    switch(type) {
      case 'Thực hành đường trường (DAT)': return 'bg-blue-500'
      case 'Thực hành Sa hình': return 'bg-orange-500'
      case 'Lý thuyết / Mô phỏng': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const openModal = (event = null, specificDate = null) => {
    if (event) {
      setEditingEvent(event)
      setFormData(event)
    } else {
      setEditingEvent(null)
      setFormData({
        title: '',
        studentName: '',
        date: specificDate || selectedDay.toISOString().split('T')[0],
        startTime: '08:00',
        endTime: '10:00',
        type: 'Thực hành đường trường (DAT)',
        note: ''
      })
    }
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingEvent) {
      const updated = events.map(ev => ev.id === editingEvent.id ? { ...formData, id: ev.id } : ev)
      saveEvents(updated)
      toast.success('Đã cập nhật lịch giảng dạy')
    } else {
      const newEvent = { ...formData, id: Date.now().toString() }
      saveEvents([...events, newEvent])
      toast.success('Đã thêm lịch mới')
    }
    setShowModal(false)
  }

  const handleDelete = (id) => {
    if(window.confirm('Bạn có chắc chắn muốn xóa lịch này?')) {
      saveEvents(events.filter(e => e.id !== id))
      toast.success('Đã xóa lịch')
      setShowModal(false)
    }
  }

  // Lọc sự kiện cho Ngày được chọn
  const selectedDateStr = `${selectedDay.getFullYear()}-${String(selectedDay.getMonth()+1).padStart(2,'0')}-${String(selectedDay.getDate()).padStart(2,'0')}`
  const dayEvents = events.filter(e => e.date === selectedDateStr).sort((a,b) => a.startTime.localeCompare(b.startTime))

  // Hàm xử lý xuất Excel
  const handleExportExcel = () => {
    if (events.length === 0) {
      toast.info('Không có dữ liệu lịch dạy để xuất')
      return
    }

    // Sắp xếp sự kiện theo Ngày -> Giờ bắt đầu
    const sortedEvents = [...events].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return a.startTime.localeCompare(b.startTime)
    })

    // Định dạng lại dữ liệu cột
    const dataToExport = sortedEvents.map((item, index) => ({
      'STT': index + 1,
      'Ngày dạy': new Date(item.date).toLocaleDateString('vi-VN'),
      'Thời gian': `${item.startTime} - ${item.endTime}`,
      'Học viên': item.studentName,
      'Nội dung bài học': item.title,
      'Loại hình đào tạo': item.type,
      'Ghi chú': item.note || ''
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "LichGiangDay")
    XLSX.writeFile(workbook, `DanhSachLichDay_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.xlsx`)
  }

  return (
    <div className='w-full'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>Lịch giảng dạy</h1>
        <div className='flex flex-wrap gap-2 w-full md:w-auto md:justify-end'>
          <button 
            onClick={handleExportExcel}
            className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium w-full md:w-auto transition-colors'
          >
            <span className="material-symbols-outlined text-[20px]">download</span> Xuất Excel
          </button>
          <button 
            onClick={() => setView(view === 'month' ? 'day' : 'month')}
            className='bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2'
          >
            <span className="material-symbols-outlined text-[20px]">{view === 'month' ? 'view_agenda' : 'calendar_month'}</span>
            {view === 'month' ? 'Xem theo ngày' : 'Xem theo tháng'}
          </button>
          <button 
            onClick={() => openModal(null, view === 'day' ? selectedDateStr : null)}
            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium w-full md:w-auto'
          >
            <span className="material-symbols-outlined text-[20px]">add</span> Thêm lịch
          </button>
        </div>
      </div>

      <div className='bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden'>
        {/* CALENDAR HEADER */}
        <div className='flex flex-col md:flex-row items-center justify-between p-4 border-b border-gray-200 bg-gray-50/50 gap-4'>
          <h2 className='text-lg md:text-xl font-bold text-gray-800 capitalize order-1 md:order-2'>
            {view === 'month' ? `Tháng ${month + 1} - ${year}` : `Ngày ${selectedDay.getDate()} Tháng ${selectedDay.getMonth() + 1}, ${selectedDay.getFullYear()}`}
          </h2>
          <div className='flex items-center justify-between md:justify-start gap-4 w-full md:w-auto order-2 md:order-1'>
            <button onClick={handleToday} className='px-3 py-1.5 bg-white border border-gray-300 rounded text-sm font-medium hover:bg-gray-50'>
              Hôm nay
            </button>
            <div className='flex items-center gap-1'>
              <button onClick={view === 'month' ? handlePrevMonth : () => setSelectedDay(new Date(selectedDay.setDate(selectedDay.getDate() - 1)))} className='p-1 rounded-full hover:bg-gray-200 text-gray-600 flex items-center justify-center bg-white border border-gray-200 shadow-sm'><span className="material-symbols-outlined">chevron_left</span></button>
              <button onClick={view === 'month' ? handleNextMonth : () => setSelectedDay(new Date(selectedDay.setDate(selectedDay.getDate() + 1)))} className='p-1 rounded-full hover:bg-gray-200 text-gray-600 flex items-center justify-center bg-white border border-gray-200 shadow-sm'><span className="material-symbols-outlined">chevron_right</span></button>
            </div>
          </div>
        </div>

        {/* MONTH VIEW */}
        {view === 'month' && (
          <div className='w-full'>
            <div className='grid grid-cols-7 border-b border-gray-200 bg-gray-100'>
              {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
                <div key={d} className='py-3 text-center text-sm font-bold text-gray-600'>{d}</div>
              ))}
            </div>
            <div className='grid grid-cols-7 border-l border-gray-200'>
              {blanks.map((_, i) => (
                <div key={`blank-${i}`} className='min-h-[80px] md:min-h-[120px] border-r border-b border-gray-200 bg-gray-50/30'></div>
              ))}
              {days.map(d => {
                const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
                const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year
                const cellEvents = events.filter(e => e.date === dateStr).sort((a,b) => a.startTime.localeCompare(b.startTime))
                
                return (
                  <div 
                    key={d} 
                    onClick={() => { setSelectedDay(new Date(year, month, d)); setShowDayEventsModal(true) }} 
                    className='min-h-[80px] md:min-h-[120px] border-r border-b border-gray-200 p-1 md:p-2 hover:bg-blue-50 cursor-pointer transition-colors relative group flex flex-col items-center md:items-start'
                  >
                    <div className={`font-medium text-xs md:text-sm mb-1 md:mb-1.5 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700'}`}>
                      {d}
                    </div>
                    {/* Desktop events */}
                    <div className='hidden md:flex flex-col gap-1.5 w-full'>
                      {cellEvents.slice(0, 3).map(e => (
                        <div 
                          key={e.id} 
                          onClick={(ev) => { ev.stopPropagation(); openModal(e) }} 
                          className={`text-xs px-2 py-1 rounded truncate border ${getTypeStyles(e.type)} hover:opacity-80`}
                          title={`${e.startTime} - ${e.title} (${e.studentName})`}
                        >
                          <span className='font-bold mr-1'>{e.startTime}</span> {e.title}
                        </div>
                      ))}
                      {cellEvents.length > 3 && (
                        <div className='text-xs text-gray-500 font-bold pl-1'>+ {cellEvents.length - 3} lịch</div>
                      )}
                    </div>
                    {/* Mobile events (Dots) */}
                    <div className='flex md:hidden flex-wrap justify-center gap-1 mt-1 w-full'>
                      {cellEvents.slice(0, 3).map(e => (
                        <div key={e.id} className={`w-2 h-2 rounded-full ${getTypeBorder(e.type)}`}></div>
                      ))}
                      {cellEvents.length > 3 && (
                        <div className='w-2 h-2 rounded-full bg-gray-400'></div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* DAY VIEW */}
        {view === 'day' && (
          <div className='p-6 bg-gray-50 min-h-[500px]'>
            {dayEvents.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-64 text-gray-500'>
                <span className="material-symbols-outlined text-6xl mb-4 text-gray-300">event_busy</span>
                <p className='text-lg'>Không có lịch giảng dạy nào trong ngày này.</p>
                <button onClick={() => openModal(null, selectedDateStr)} className='mt-4 text-blue-600 hover:underline font-medium'>+ Thêm lịch mới</button>
              </div>
            ) : (
              <div className='flex flex-col gap-4 max-w-4xl mx-auto'>
                {dayEvents.map(e => (
                  <div key={e.id} className='flex bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all group'>
                    <div className={`w-2 shrink-0 ${getTypeBorder(e.type)}`}></div>
                    <div className='p-4 md:p-5 flex-1 flex flex-col sm:flex-row justify-between gap-4'>
                      <div className='flex-1'>
                        <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2'>
                          <div className='text-[#135bec] font-black text-sm md:text-base flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-lg w-fit'>
                            <span className="material-symbols-outlined text-[16px] md:text-[18px]">schedule</span> {e.startTime} - {e.endTime}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full border w-fit ${getTypeStyles(e.type)}`}>{e.type}</span>
                        </div>
                        <h4 className='font-bold text-lg text-gray-900 mt-2'>{e.title}</h4>
                        <div className='flex items-center gap-4 text-sm text-gray-600 mt-2'>
                          <span className='flex items-center gap-1'><span className="material-symbols-outlined text-[16px]">person</span> Học viên: <strong className='text-gray-800'>{e.studentName}</strong></span>
                        </div>
                        {e.note && <p className='text-sm text-gray-500 mt-2 italic bg-gray-50 p-2 rounded'>Ghi chú: {e.note}</p>}
                      </div>
                      <div className='flex flex-row sm:flex-col items-center sm:items-end justify-end border-t sm:border-t-0 pt-4 sm:pt-0 gap-2'>
                          <button onClick={() => openModal(e)} className='flex-1 sm:flex-none justify-center text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1'>
                            <span className="material-symbols-outlined text-[16px]">edit</span> Sửa
                          </button>
                          <button onClick={() => handleDelete(e.id)} className='flex-1 sm:flex-none justify-center text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1'>
                            <span className="material-symbols-outlined text-[16px]">delete</span> Xóa
                          </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* DAY EVENTS MODAL (Popup danh sách sự kiện trong ngày) */}
      {showDayEventsModal && (
        <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center'>
              <h3 className='text-lg font-bold text-gray-900'>
                Lịch ngày {selectedDay.getDate()}/{selectedDay.getMonth() + 1}/{selectedDay.getFullYear()}
              </h3>
              <button onClick={() => setShowDayEventsModal(false)} className='text-gray-400 hover:text-gray-600'>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className='p-6 max-h-[60vh] overflow-y-auto bg-gray-50/50'>
              {dayEvents.length === 0 ? (
                <div className='text-center text-gray-500 py-6'>
                  <span className="material-symbols-outlined text-4xl mb-2 text-gray-300">event_busy</span>
                  <p>Không có lịch dạy nào trong ngày này.</p>
                </div>
              ) : (
                <div className='flex flex-col gap-4'>
                  {dayEvents.map(e => (
                    <div key={e.id} className='bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-2 relative overflow-hidden'>
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${getTypeBorder(e.type)}`}></div>
                      <div className='pl-2'>
                        <div className='flex justify-between items-start mb-2'>
                          <h4 className='font-bold text-gray-900'>{e.title}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getTypeStyles(e.type)}`}>{e.type}</span>
                        </div>
                        <div className='text-sm text-gray-600 flex items-center gap-1.5 mb-1'>
                          <span className="material-symbols-outlined text-[16px]">schedule</span>
                          <span className='font-bold text-[#135bec]'>{e.startTime} - {e.endTime}</span>
                        </div>
                        <div className='text-sm text-gray-600 flex items-center gap-1.5'>
                          <span className="material-symbols-outlined text-[16px]">person</span>
                          Học viên: <strong className='text-gray-800'>{e.studentName}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className='px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3'>
              <button onClick={() => setShowDayEventsModal(false)} className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium'>Đóng</button>
              <button onClick={() => { setShowDayEventsModal(false); openModal(null, selectedDateStr); }} className='px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-1'>
                <span className="material-symbols-outlined text-[18px]">add</span> Thêm lịch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EVENT MODAL */}
      {showModal && (
        <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center'>
              <h3 className='text-lg font-bold text-gray-900'>{editingEvent ? 'Chỉnh sửa lịch dạy' : 'Thêm lịch dạy mới'}</h3>
              <button onClick={() => setShowModal(false)} className='text-gray-400 hover:text-gray-600'><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleSubmit} className='p-6 flex flex-col gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Tiêu đề / Nội dung bài học *</label>
                <input className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none' value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="VD: Tập dốc cầu, Chạy DAT..." />
              </div>
              
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Tên học viên *</label>
                  <input className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none' value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} required />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Loại hình đào tạo *</label>
                  <select className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none' value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="Thực hành đường trường (DAT)">Thực hành đường trường (DAT)</option>
                    <option value="Thực hành Sa hình">Thực hành Sa hình</option>
                    <option value="Lý thuyết / Mô phỏng">Lý thuyết / Mô phỏng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Ngày dạy *</label>
                <input type="date" className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none' value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Giờ bắt đầu *</label>
                  <input type="time" className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none' value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} required />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Giờ kết thúc *</label>
                  <input type="time" className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none' value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} required />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Ghi chú thêm (Tùy chọn)</label>
                <textarea className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none' rows="2" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} placeholder="Ghi chú về địa điểm đón, xe tập..."></textarea>
              </div>

              <div className='flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100'>
                {editingEvent && (
                  <button type="button" onClick={() => handleDelete(editingEvent.id)} className='px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium mr-auto'>Xóa lịch</button>
                )}
                <button type="button" onClick={() => setShowModal(false)} className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium'>Hủy</button>
                <button type="submit" className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md'>Lưu lịch dạy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSchedule