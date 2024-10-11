/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  content: [
    "./resources/**/*.edge",
    "./resources/**/*.{js,ts,jsx,tsx,vue}",
    "./node_modules/flowbite/**/*.js"
  ],
  plugins: [
    require('flowbite/plugin')
],
  theme: {
    extend: {
      fontFamily:{
        'reddit': ['Reddit'],
        'lato': ['Lato', 'sans-serif']
      },
      
    },
  },

}

