import { assets } from '../assets/assets'

export const products = [
  {
    id: 'b1-sotudong',
    title: 'Hạng B1 - Số tự động',
    image: assets.b1sotudong,
    duration: '3 tháng',
    vehicle: 'Vios 2022 AT',
    highlights: ['Lý thuyết không giới hạn', 'Xe mới, an toàn'],
    oldPrice: '16.000.000đ',
    price: '13.500.000đ',
    description: 'Dành cho người không hành nghề lái xe. Lái xe số tự động chở người đến 9 chỗ ngồi.'
  },
  {
    id: 'b2-sosan',
    title: 'Hạng B2 - Số sàn',
    image: assets.b1sosan,
    duration: '3.5 tháng',
    vehicle: 'Vios 2022 MT',
    highlights: ['Hỗ trợ việc làm', 'Giáo viên tận tâm'],
    oldPrice: '16.000.000đ',
    price: '13.500.000đ',
    description: 'Được phép kinh doanh vận tải. Lái xe số sàn và số tự động đến 9 chỗ ngồi, xe tải dưới 3.5 tấn.'
  },
  {
    id: 'c-xetai',
    title: 'Hạng C - Xe tải',
    image: assets.c1xetai,
    duration: '3.5 tháng',
    vehicle: 'Isuzu/Thaco',
    highlights: ['Nâng hạng dễ dàng', 'Thực hành nhiều'],
    oldPrice: '22.000.000đ',
    price: '18.000.000đ',
    description: 'Lái xe tải chuyên dụng trên 3.5 tấn. Được phép điều khiển các loại xe của bằng B1, B2.'
  }
]
