/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        severity: {
          low: '#10b981',       // green-500
          moderate: '#f59e0b',  // amber-500
          high: '#f97316',      // orange-500
          critical: '#ef4444',  // red-500
        },
        brand: {
          bg: '#020617',        // slate-950 (deepest navy/black)
          panel: 'rgba(15, 23, 42, 0.65)',   // slate-900 with glass opacity
          border: 'rgba(51, 65, 85, 0.4)',    // slate-700 translucent border
          text: '#f8fafc',      // slate-50
          muted: '#94a3b8',     // slate-400
          accent: '#3b82f6',    // blue-500 (emergency brand accent)
          accentBg: 'rgba(59, 130, 246, 0.1)',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-blue': '0 0 15px rgba(59, 130, 246, 0.35)',
        'glow-red': '0 0 15px rgba(239, 68, 68, 0.35)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
