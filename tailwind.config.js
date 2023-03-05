/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      'animation': {
        'text':'text 1s ease infinite',
      },
      'keyframes': {
          'text': {
              '0%, 100%': {
                'background-size':'200% 200%',
                  'background-position': 'left center'
              },
              '50%': {
                'background-size':'200% 200%',
                  'background-position': 'center right'
              }
          },
      }
    },
    fontFamily: {
      sans: [
        "Inter, sans-serif",
        { fontFeatureSettings: '"cv11", "ss01"' },
      ],
      serif: [
        "Poppins, sans-serif",
        { fontFeatureSettings: '"cv11", "ss01"' },
      ]
    }
  },
  plugins: [],
}
