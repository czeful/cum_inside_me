/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Кастомные цвета
        primary: {
          100: '#dbeafe', // светло-голубой (для focus-ring)
          200: '#bfdbfe', // мягкий голубой (граница)
          400: '#60a5fa', // основной голубой (фокус)
          600: '#2563eb', // primary button
          700: '#1d4ed8', // hover primary
        },
        neutral: {
          100: '#f5f5f5', // фон
          200: '#e5e5e5', // границы
          400: '#a3a3a3', // серый текст
          800: '#262626', // темный текст
        },
        danger: {
          600: '#dc2626', // красный (кнопка удалить)
          700: '#b91c1c', // hover danger
        },
        success: {
          400: '#4ade80', // зеленый (прогресс)
          500: '#22c55e', 
        },
      },
      // Дополнительные кастомные классы
      boxShadow: {
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}