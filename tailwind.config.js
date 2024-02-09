/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      colors:{
        'primary':'#FFFFFF',
        'secondary':'#E1E5F2',
        'accent':'#BFDBF7',
        'dsecondary':'#1F7A8C',
        'dprimary':'#022B3A',
      }
    },
  },
  plugins: [],
}

