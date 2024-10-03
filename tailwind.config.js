const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // https://gradient.page/hex/0085CA
        // https://color.adobe.com/fr/create/color-contrast-analyzer
        // primary: {
        //   DEFAULT: 'hsl(213, 100%, 40%)',
        //   foreground: 'hsl(213, 10%, 97%)'
        // },
        // secondary: {
        //   DEFAULT: 'hsl(213, 50%, 12%)',
        //   foreground: 'hsl(213, 10%, 97%)'
        // },
        primary: {
          DEFAULT: "#0085CA",
          500: '#0085CA',
          700: '#005CCC',
          900: '#0F1D2E',
        },
        secondary: {
          DEFAULT: "#FD8112",
          500: '#FD8112',
          700: "#7F1D1D",
          900: "#3C2915"
        },
        success: {
          DEFAULT: "#8FCF50",
          500: '#60AF20',
        },
        info: {
          DEFAULT: "#0495EE",
          500: '#0495EE',
        },
        warning: {
          DEFAULT: "#FF9F05",
          500: '#FF9F05',
        },
        danger: {
          DEFAULT: "#B00020",
          500: '#B00020',
        },
        basic: {
          DEFAULT: "#B3B3B3",
          500: '#B3B3B3',
        },
        gradient: '#0085CA',
        background: 'hsl(213, 65%, 3.2%)',
        foreground: 'hsl(213, 10%, 97%)',
        muted: {
          DEFAULT: 'hsl(213, 10%, 54%)',
          foreground: 'hsl(213, 10%, 54%)'
        },
        popover: {
          DEFAULT: 'hsl(213, 45%, 5.2%)',
          foreground: 'hsl(213, 10%, 97%)'
        },
        card: {
          DEFAULT: 'hsl(213, 50%, 12%)',
          500: 'hsl(213, 50%, 12%)',
          600: "#1C2B38",
          foreground: 'hsl(213, 10%, 97%)'
        },
        filters: 'hsl(213, 50%, 12%)',
        border: 'hsl(213, 50%, 12%)',
        input: 'hsl(213, 50%, 12%)',
        accent: {
          DEFAULT: 'hsl(213, 50%, 12%)',
          foreground: 'hsl(213, 10%, 97%)'
        },
        destructive: {
          DEFAULT: '#B00020',
          foreground: 'hsl(213, 10%, 97%)'
        },
        pills: {
          DEFAULT: "#9400D3",
          black: "#000000",
          white: "#FFFFFF",
          gray: "#808080",
          silver: "#C0C0C0",
          maroon: "#800000",
          purple: "#800080",
          fuchsia: "#FF00FF",
          green: "#008000",
          lime: "#00FF00",
          olive: "#808000",  
          navy: "#000080",
          teal: "#008080",
          aqua: "#00FFFF",
          violet: "#9400D3",
          indigo: "#4B0082",
          blue: "#0000FF",
          yellow: "#FFFF00",
          orange: "#FF7F00",
          red: "#FF0000"
        },
        ring: 'hsl(213, 100%, 40%)',
        issues: "#3de63d",
        personal: "#4B0082",
        contributed: "#3e64ed",
        commits: "#A9A9A9",
        code: "#A9A9A9",
        pullRequests: "#3e64ed",
        "merge-requests": "#3e64ed",
        organizations : "#FD8112",
        members: "#c7ff33"
        licences: "#3e64ed",
        starred: "#d5e",
        cicd: "#d5ea4e",
        branches: "#d5ea4e",
        discussions: "#9370DB",
        actions: "#8FCF50",
        projects: "#A9A9A9",
        repositories: "#696969",
        packages: "#FF9F05",
        security: "#B00020",
        insights: "#B3B3B3",
        settings: "#B3B3B3",
        admin: "#B3B3B3",
        
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
