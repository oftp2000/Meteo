// tailwind.config.js
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          gold: '#FFD700',
        },
        keyframes: {
          'fade-in-up': {
            '0%': {
              opacity: '0',
              transform: 'translateY(20px)'
            },
            '100%': {
              opacity: '1',
              transform: 'translateY(0)'
            }
          },
          'shake': {
            '0%, 100%': { transform: 'translateX(0)' },
            '25%': { transform: 'translateX(-5px)' },
            '75%': { transform: 'translateX(5px)' }
          }
        },
        animation: {
          'fade-in-up': 'fade-in-up 0.6s ease-out',
          'shake': 'shake 0.4s ease-in-out'
        }
      }
    },
    plugins: [],
  }