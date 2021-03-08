// Default Theme Setting
// max-w-screen-xl mx-auto px-6 lg:px-8

module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
        zIndex: {
            '0': 0,
            '1': 1,
            '10': 10,
            '20': 20,
            '30': 30,
            '40': 40,
            '50': 50,
            '25': 25,
            '50': 50,
            '75': 75,
            '100': 100,
            'auto': 'auto',
        },
        screens: {
            'mm': '375px',
            'ml': '425px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
        }
    },
    variants: {
        extend: {},
        mixBlendMode: ['responsive'],
        backgroundBlendMode: ['responsive'],
        isolation: ['responsive'],
        display: ['responsive', 'group-hover', 'group-focus'],
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/line-clamp'),
        require('@markusantonwolf/tailwind-css-plugin-filters'),
        require('tailwindcss-blend-mode')()
    ]
}