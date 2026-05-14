/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg:      '#0f0f0f',
        surface: '#161616',
        card:    '#1c1c1c',
        accent:  '#FF6B35',
        teal:    '#00D4AA',
        violet:  '#7B61FF',
        ink:     '#e8e6df',
        muted:   '#888580',
        warn:    '#FFB347',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        body:  ['"Source Serif 4"', 'Georgia', 'serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
      },
      typography: ({ theme }) => ({
        blog: {
          css: {
            '--tw-prose-body':         theme('colors.ink'),
            '--tw-prose-headings':     '#f0ede6',
            '--tw-prose-lead':         theme('colors.muted'),
            '--tw-prose-links':        theme('colors.accent'),
            '--tw-prose-bold':         '#f0ede6',
            '--tw-prose-counters':     theme('colors.muted'),
            '--tw-prose-bullets':      theme('colors.accent'),
            '--tw-prose-hr':           'rgba(255,255,255,0.1)',
            '--tw-prose-quotes':       '#d0cdc6',
            '--tw-prose-quote-borders': theme('colors.accent'),
            '--tw-prose-code':         '#00D4AA',
            '--tw-prose-pre-code':     '#e8e6df',
            '--tw-prose-pre-bg':       '#1c1c1c',
            '--tw-prose-th-borders':   'rgba(255,255,255,0.1)',
            '--tw-prose-td-borders':   'rgba(255,255,255,0.06)',
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
