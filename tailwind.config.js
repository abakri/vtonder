module.exports = ({
  content: ["./src/**/*.tsx", "./src/**/*.ts", "./index.html"],
  theme: {
    fontFamily: {
      fredoka: ["Fredoka", "sans-serif"],
    },
    extend: {
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
