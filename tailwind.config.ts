import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        foreground: '#e5e5e5',
        background: '#0a0a0a',

        /* BRAND PRIMARY BLUE — based on your colors */
        primary: {
          50:  '#e8f1ff',
          100: '#d0e3ff',
          200: '#a3c6ff',
          300: '#76aaff',
          400: '#4f92ff',
          500: '#3186ff',  // brand blue
          600: '#2a6fd6',
          700: '#2358ad',
          800: '#1b4285',
          900: '#142c5c',
        },

        /* SECONDARY COLOR */
        secondary: {
          50:  '#f5f5f5',
          100: '#e5e5e5',
          200: '#d4d4d4',
          300: '#a3a3a3',
          400: '#737373',
          500: '#252525',   // Main secondary color
          600: '#1f1f1f',
          700: '#1a1a1a',
          800: '#141414',
          900: '#0f0f0f',
        },

        /* ACCENT — lighter / glowing blue */
        accent: {
          50:  '#f2f8ff',
          100: '#e5f1ff',
          200: '#c7e3ff',
          300: '#a9d5ff',
          400: '#8bc7ff',
          500: '#4fa0ff',   // reused for consistency
          600: '#3186ff',
          700: '#2b6dd1',
          800: '#2454a3',
          900: '#1c3b75',
        },

        /* DARK THEME */
        dark: {
          bg: '#08090c',
          surface: '#111214',
          surface2: '#16181b',
          text: '#e5e5e5',
          text2: '#9ca3af',
        },

        /* LIGHT THEME - Brand-aligned, high contrast */
        light: {
          bg: '#EAEAEA',           // Background color
          surface: '#ffffff',      // White cards for contrast
          surface2: '#f1f5f9',     // Subtle slate for secondary surfaces
          text: '#252525',         // Primary text color
          text2: '#252525',        // Secondary text color
          border: '#cbd5e1',       // Slate-300 for visible borders
        },
      },

      /* BRAND GLOW EFFECTS */
      boxShadow: {
        glow: '0 0 40px rgba(49, 134, 255, 0.25)',           // #3186ff
        'accent-glow': '0 0 50px rgba(79, 160, 255, 0.20)',  // #4fa0ff
      },

      /* BRAND RADIANT BACKGROUND LIGHTING */
      backgroundImage: {
        "grid-dots":
          "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",

        /* Blue-themed radial light */
        "radial-light":
          "radial-gradient(circle at top, rgba(49,134,255,0.20), transparent 55%)",
      },

      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
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
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.95)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
          '100%': { transform: 'translateY(0px)' },
        },
      },
    },
  },
  safelist: [
    // Safelist for dynamic section widths
    {
      pattern: /w-\[(50|55|60|65|70|75|80|85|90|95)%\]/,
    },
  ],
  plugins: [],
}

export default config
