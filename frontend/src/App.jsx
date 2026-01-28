import React, { useEffect, useState } from 'react'
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Context
import { AuthProvider, useAuth } from './context/AuthContext'
import { LoadingProvider } from './context/LoadingContext'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import LoadingOverlay from './components/LoadingOverlay'
import BackToTopButton from './components/BackToTopButton'
import FloatingContact from './components/FloatingContact'
import AdminRoute from './components/AdminRoute'
import AdminLayout from './components/AdminLayout'

// Pages
import Home from './pages/Home'
import Introduce from './pages/Introduce'
import Course from './pages/Course'
import Tuition from './pages/Tuition'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import Contact from './pages/Contact'
import RegisterForTheCourse from './pages/RegisterForTheCourse'
import Product from './pages/Product'
import Login from './pages/Login'
import DrivingPracticeCar from './pages/DrivingPracticeCar'
import PassRate from './pages/PassRate'
import TuitionPolicy from './pages/TuitionPolicy'
import Timeframe from './pages/Timeframe'
import NotFound from './pages/NotFound'
import Gallery from './pages/Gallery'
import VideoLibrary from './pages/VideoLibrary'

// Admin Pages
import AdminDashboard from './pages/AdminDashboard'
import AdminContacts from './pages/AdminContacts'
import AdminCourses from './pages/AdminCourses'
import AdminCourseDetail from './pages/AdminCourseDetail'
import AdminNews from './pages/AdminNews'
import AdminNewsDetail from './pages/AdminNewsDetail'
import AdminGallery from './pages/AdminGallery'
import AdminVideos from './pages/AdminVideos'
import Settings from './pages/Settings'
import AdminProfile from './pages/AdminProfile'
import StudentDetail from './pages/StudentDetail'
import AdminAuditLog from './pages/AdminAuditLog'
import Maintenance from './pages/Maintenance'

const PublicLayout = () => (
  <>
    <Navbar />
    <div className='flex-grow'>
      <Outlet />
    </div>
    <Footer />
    <BackToTopButton />
    <FloatingContact />
  </>
)

const AppRoutes = () => {
  const { isAdmin } = useAuth() // useAuth hoạt động ở đây vì AppRoutes nằm trong AuthProvider
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [loadingSettings, setLoadingSettings] = useState(true)
  const location = useLocation()
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:5000'

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then(res => res.json())
      .then(data => {
        setMaintenanceMode(data.maintenanceMode)
        setLoadingSettings(false)
      })
      .catch(() => setLoadingSettings(false))
  }, [API_BASE])

  if (loadingSettings) return null

  // Logic hiển thị trang bảo trì:
  // Hiện nếu: Đang bảo trì AND Không phải Admin AND Không phải trang Login AND Không phải trang Admin
  const isLoginRoute = location.pathname === '/login'
  const isAdminRoute = location.pathname.startsWith('/admin')

  if (maintenanceMode && !isAdmin && !isLoginRoute && !isAdminRoute) {
    return <Maintenance />
  }

  return (
        <div className='min-h-screen flex flex-col font-sans text-gray-900'>
          <ToastContainer position="top-right" autoClose={3000} />
          <LoadingOverlay />
          <ScrollToTop />
          
          <Routes>
            {/* Admin Routes (Protected) */}
            <Route path='/admin' element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path='contacts' element={<AdminContacts />} />
              <Route path='courses' element={<AdminCourses />} />
              <Route path='courses/:id' element={<AdminCourseDetail />} />
              <Route path='gallery' element={<AdminGallery />} />
              <Route path='videos' element={<AdminVideos />} />
              <Route path='news' element={<AdminNews />} />
              <Route path='news/:id' element={<AdminNewsDetail />} />
              <Route path='audit-logs' element={<AdminAuditLog />} />
              
              {/* Chỉ Super Admin mới vào được trang Cài đặt */}
              <Route path='settings' element={<AdminRoute allowedRoles={['admin', 'superadmin']}><Settings /></AdminRoute>} />
              <Route path='profile' element={<AdminProfile />} />
              <Route path='student/:id' element={<StudentDetail />} />
            </Route>

            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path='/' element={<Home />} />
              <Route path='/gioi_thieu' element={<Introduce />} />
              <Route path='/khoa_hoc' element={<Course />} />
              <Route path='/hoc_phi' element={<Tuition />} />
              <Route path='/tin_tuc' element={<News />} />
              <Route path='/tin_tuc/:id' element={<NewsDetail />} />
              <Route path='/lien_he' element={<Contact />} />
              <Route path='/dangkykhoahoc' element={<RegisterForTheCourse />} />
              <Route path='/product/:productId' element={<Product />} />
              <Route path='/login' element={<Login />} />
              <Route path='/hethongxetaplai' element={<DrivingPracticeCar />} />
              <Route path='/tiledau' element={<PassRate />} />
              <Route path='/chinhsachhocphi' element={<TuitionPolicy />} />
              <Route path='/giohoc' element={<Timeframe />} />
              <Route path='/thu-vien-anh' element={<Gallery />} />
              <Route path='/thu-vien-video' element={<VideoLibrary />} />
              
              {/* Catch-all Route for 404 */}
              <Route path='*' element={<NotFound />} />
            </Route>
          </Routes>
        </div>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <LoadingProvider>
        <AppRoutes />
      </LoadingProvider>
    </AuthProvider>
  )
}

export default App