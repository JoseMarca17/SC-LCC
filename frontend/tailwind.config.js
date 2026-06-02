/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        negroTactico: '#060A12',
        grisOscuro: '#0D1520',
        grisMedio: '#1A2840',
        grisLinea: '#1E3050',
        azulFAB: '#003087',
        azulMedio: '#0057B8',
        azulClaro: '#1A78D4',
        amarilloFAB: '#FFD100',
        amarilloDim: '#C8A200',
        textoBase: '#C8D8EE',
        textoDim: '#6A88A8',
      },
      fontFamily: {
        display: ['Barlow Condensed', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace'],
        ui: ['Rajdhani', 'sans-serif'],
      },
    },
  },
  plugins: [],
}