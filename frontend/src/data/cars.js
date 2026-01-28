import { assets } from '../assets/assets'

export const cars = [
  {
    id: 1,
    tag: 'Hạng B1',
    img: assets.toyotavios,
    title: 'Toyota Vios 2025',
    desc: 'Số tự động (AT)',
    transmission: 'AT',
    features: ['Camera lùi', 'Cảm biến', 'Điều hòa Auto'],
    maintenance: 'T8/2023',
  },
  {
    id: 2,
    tag: 'Hạng B2',
    img: assets.hyundaiaccent,
    title: 'Hyundai accent 2022',
    desc: 'Số sàn (MT)',
    transmission: 'MT',
    features: ['Côn nhẹ', 'Trợ lực lái', 'Phanh ABS'],
    maintenance: 'T8/2023',
  },
  {
    id: 3,
    tag: 'Hạng C',
    img: assets.isuzuQKR,
    title: 'Isuzu QKR 270',
    desc: 'Xe tải chuyên dụng',
    transmission: 'MT',
    features: ['Tầm nhìn rộng', 'Gương cầu lồi', 'Cabin rộng'],
    maintenance: 'T8/2023',
  },
]
