module.exports = ({
  content: ["./src/**/*.tsx", "./src/**/*.ts", "./index.html"],
  theme: {
    backgroundImage: {
      'gradient-45': 'linear-gradient(45deg, var(--tw-gradient-from) 20%, var(--tw-gradient-to) 100%)',
    },
    fontFamily: {
      fredoka: ["Fredoka", "sans-serif"],
    },
    extend: {
      colors: {
        gradstart: 'var(--color-gradient-start)',
        gradend: 'var(--color-gradient-end)',
      },
      textColor: {
        theme: {
          primary: 'var(--color-text-primary)',
          outline: 'var(--color-text-outline)',
          icon: 'var(--color-icon-primary)',
        }
      },
      backgroundColor: {
        theme: {
          muted: 'var(--color-background-muted)',
          outline: 'var(--color-background-outline)',
        },
      },
      borderColor: {
        theme: {
          primary: 'var(--color-border-primary)',
          secondary: 'var(--color-border-secondary)',
          choice: 'var(--color-choice-border)',
        }
      },
    },
  },
  variants: { // all the following default to ['responsive']
    imageRendering: ['responsive'],
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ]
});
