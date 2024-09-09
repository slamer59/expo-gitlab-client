const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // https://color.adobe.com/fr/create/image
        //https://images.ctfassets.net/8j5aqoy0ts8s/2pyzJIOTejrq1jM0QVA68l/7ea6ba1d6bb4dfee310fcb64d51eb3fa/dark-mode-light-mode.png
        dark: {
          DEFAULT: "#161A1D",
          darker: "#22272B",
          text: "#7C8B9B",
        },
        'primary': {
          light: '#3490dc',
          dark: '#90cdf4',
        },
        'secondary': {
          light: '#ffed4a',
          dark: '#faf089',
        },
        'background': {
          light: '#ffffff',
          dark: '#1a202c',
        },
        'text': {
          light: '#2d3748',
          dark: '#f7fafc',
        },
        'accent': {
          light: '#ed64a6',
          dark: '#fbb6ce',
        },
        'success': {
          light: '#38a169',
          dark: '#9ae6b4',
        },
        'warning': {
          light: '#ecc94b',
          dark: '#faf089',
        },
        'danger': {
          light: '#e53e3e',
          dark: '#feb2b2',
        },
        light: "#D9D4BA",
        // primary: "#59082E", // 240,86,199 #F056C7
        // primaryDark: "#A63333", // 80,230,217
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
