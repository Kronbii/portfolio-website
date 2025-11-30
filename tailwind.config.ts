import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Gemini Blue gradient palette
        gemini: {
          50: '#e8f4ff',
          100: '#d5ebff',
          200: '#b3d9ff',
          300: '#85c1ff',
          400: '#569eff',
          500: '#4285f4',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        
        // Accent colors for gradients
        accent: {
          blue: '#4285f4',
          purple: '#8b5cf6',
          cyan: '#06b6d4',
          pink: '#ec4899',
          teal: '#14b8a6',
        },
        
        // Primary colors (Gemini inspired)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#4285f4',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        dark: {
          bg: '#0a0a0a',
          surface: '#111111',
          surface2: '#1a1a1a',
          text: '#e5e5e5',
          text2: '#a3a3a3',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 40px rgba(66, 133, 244, 0.3)',
        'glow-lg': '0 0 60px rgba(66, 133, 244, 0.4)',
        'glow-purple': '0 0 50px rgba(139, 92, 246, 0.25)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'glass-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inset-glow': 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gemini-gradient': 'linear-gradient(135deg, #4285f4 0%, #8b5cf6 50%, #06b6d4 100%)',
        'gemini-gradient-text': 'linear-gradient(90deg, #4285f4, #8b5cf6, #4285f4)',
        'gemini-radial': 'radial-gradient(circle at center, rgba(66, 133, 244, 0.15), transparent 70%)',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'glass-dark': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'grid-dots': 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
        'radial-light': 'radial-gradient(circle at top, rgba(66, 133, 244, 0.25), transparent 55%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'gradient-x': 'gradientX 15s ease infinite',
        'gradient-shimmer': 'gradientShimmer 3s ease-in-out infinite',
        'tilt': 'tilt 10s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.95)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        gradientShimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        tilt: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}
export default config
