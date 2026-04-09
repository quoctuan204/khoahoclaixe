/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Thêm dòng này để vô hiệu hoá tự động dark mode của trình duyệt
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#135bec', // Màu xanh dương chủ đạo
          'dark': '#0f49b9',   // Màu xanh đậm hơn cho trạng thái hover
          'light': '#f0f9ff',  // Màu nền xanh rất nhạt
        },
        'secondary': {
          DEFAULT: '#ff7a00', // Màu cam chủ đạo cho nút kêu gọi hành động (CTA)
          'dark': '#e66e00',   // Màu cam đậm hơn cho hover
        },
      },
      fontFamily: {
        sans: ['Lexend', 'sans-serif'],
      }
    },
  },
  plugins: [],
}