/** @type {import('tailwindcss').Config} */
// Tailwind v4: this file is used only for content path configuration.
// Theme tokens live in global.css under @theme.
export default {
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './components/**/*.tsx',
    './pages/**/*.tsx',
    './context/**/*.tsx',
  ],
};
