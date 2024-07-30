/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      purple: '#4156a3',
      'pink-600': '#f61681',
      'gray-900': '#111827',
    },
    extend: {
      colors: {
        'wristband-green': '#00ffc1',
        'red-600': '#e3342f',
        'blue-600': '#3490dc',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
};
