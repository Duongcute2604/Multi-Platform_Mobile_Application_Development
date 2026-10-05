/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // BR-UI: Tokens đồng bộ với web Bếp Nhà (DESIGN.md): mực Ink, teal, nền Mist
      colors: {
        mist: '#F1F5F5',
        surface: '#F7F9FF',
        ink: '#0A2533',
        deepteal: '#13696D',
        muted: '#97A2B0',
        star: '#FFC107',
        primary: {
          DEFAULT: '#0A2533',
          dark: '#042628',
          light: '#C6E3E5',
        },
        accent: {
          DEFAULT: '#70B9BE',
          dark: '#3DA0A7',
          light: '#BCE5E8',
        },
        cream: '#FFF1CE',
        success: '#2E7D32',
        warning: '#F9A825',
        danger: '#C62828',
        info: '#1976D2',
      },
      // BR-UI: Serif editorial cho tiêu đề giống web.
      //
      // KHÔNG để Georgia ở đầu stack: trên Windows font này có glyph tiếng Việt
      // nhưng THIẾU mark-positioning -> dấu bị tách khỏi chữ
      // (phổ biến in ra "phổ biê´n", bếp in ra "bê´p"). Đã test trực tiếp cùng
      // một chuỗi: Times New Roman/Arial render chuẩn, Georgia lỗi.
      // Times New Roman có đủ glyph + GPOS, có sẵn trên Windows/macOS/iOS;
      // Android/Linux không có thì rơi về serif (Noto Serif) cũng đủ dấu.
      fontFamily: {
        serif: ['"Times New Roman"', 'Georgia', 'ui-serif', 'serif'],
      },
    },
  },
  plugins: [],
};
