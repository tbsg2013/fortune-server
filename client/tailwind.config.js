/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#2b2118',
        cinnabar: '#9e2b25',
        cinnabarLight: '#c0392b',
        gold: '#c9a227',
        goldLight: '#e8c96a',
        rice: '#f7f1e3',
        riceDark: '#efe5cf',
        sealRed: '#c23b2a',
      },
      fontFamily: {
        kai: ['KaiTi', 'STKaiti', '楷体', 'serif'],
        song: ['SimSun', '宋体', 'serif'],
        hei: ['Microsoft YaHei', '微软雅黑', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(60, 30, 20, 0.12)',
        gold: '0 0 0 1px rgba(201, 162, 39, 0.35), 0 8px 30px rgba(60, 30, 20, 0.18)',
      },
      backgroundImage: {
        'cloud-pattern': "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 30 Q30 20 40 28 Q50 36 60 28 Q70 20 74 30 Q78 40 68 46 Q58 52 40 50 Q22 48 16 40 Q10 32 20 30 Z' fill='%23c9a227' fill-opacity='0.05'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
