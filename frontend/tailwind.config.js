/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        finflow: {
          dark: '#0A0E17',
          card: '#161B22',
          primary: '#6366F1', // Indigo/Purple
          primaryHover: '#4F46E5',
          secondary: '#10B981', // Emerald
          accent: '#8B5CF6', // Violet
          text: '#F3F4F6',
          textMuted: '#9CA3AF',
          border: '#374151'
        }
      }
    },
  },
  plugins: [],
}
