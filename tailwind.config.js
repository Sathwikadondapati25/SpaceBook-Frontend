/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Purple/Pink Theme
        bg: '#0F0A1E',
        surface: '#1A1233',
        'surface-2': '#251845',
        border: '#3D2A5C',
        'border-strong': '#5C3A8E',
        text: '#FFFFFF',
        muted: '#A89BC0',
        
        // Primary Purple
        primary: '#B794F6',
        'primary-strong': '#7C3AED',
        'primary-soft': '#2D1B4E',
        
        // Accent Pink
        accent: '#F472B6',
        'accent-strong': '#EC4899',
        'accent-soft': '#4A1A3B',
        
        // Success Green
        green: '#34D399',
        'green-strong': '#10B981',
        'green-soft': '#1A4D3E',
        
        // Warning Orange
        orange: '#FB923C',
        'orange-strong': '#F97316',
        'orange-soft': '#4A2A1A',
        
        // Danger Red
        red: '#F87171',
        'red-strong': '#EF4444',
        'red-soft': '#4A1A1A',
        
        // Info Blue
        blue: '#60A5FA',
        'blue-strong': '#3B82F6',
        'blue-soft': '#1A2A4A',
        
        'on-accent': '#FFFFFF',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '12': '12px',
        '14': '14px',
        '16': '16px',
        '18': '18px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
        '56': '56px',
        '64': '64px',
      },
      spacing: {
        '4': '4px',
        '96': '96px',
        '128': '32rem',
      },
      borderRadius: {
        '3xl': '20px',
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(183, 148, 246, 0.1), 0 4px 12px rgba(183, 148, 246, 0.05)',
        'medium': '0 2px 6px rgba(183, 148, 246, 0.15), 0 8px 20px rgba(183, 148, 246, 0.1)',
        'strong': '0 4px 12px rgba(183, 148, 246, 0.2), 0 16px 32px rgba(183, 148, 246, 0.15)',
        'glow': '0 0 20px rgba(183, 148, 246, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 250ms ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(183, 148, 246, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(183, 148, 246, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}
