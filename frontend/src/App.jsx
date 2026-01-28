import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Context
import { AuthProvider } from './context/AuthContext'
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

// Admin Pages
import AdminDashboard from './pages/AdminDashboard'
import AdminContacts from './pages/AdminContacts'
import AdminCourses from './pages/AdminCourses'
import AdminCourseDetail from './pages/AdminCourseDetail'
import AdminNews from './pages/AdminNews'
import AdminNewsDetail from './pages/AdminNewsDetail'
import Settings from './pages/Settings'
import StudentDetail from './pages/StudentDetail'

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

const App = () => {
  return (
    <AuthProvider>
      <LoadingProvider>
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
              <Route path='news' element={<AdminNews />} />
              <Route path='news/:id' element={<AdminNewsDetail />} />
              
              {/* Chỉ Super Admin mới vào được trang Cài đặt */}
              <Route path='settings' element={<AdminRoute allowedRoles={['superadmin']}><Settings /></AdminRoute>} />
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
              
              {/* Catch-all Route for 404 */}
              <Route path='*' element={<NotFound />} />
            </Route>
          </Routes>
        </div>
      </LoadingProvider>
    </AuthProvider>
  )
}

export default App