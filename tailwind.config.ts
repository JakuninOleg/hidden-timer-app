import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        stopwatchPurple: '#C3A8F1',
        stopwatchYellow: '#FFD700',
        stopwatchBlue: '#1E3A8A',
      },
    },
  },
  plugins: [],
}
export default config
