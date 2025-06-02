/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    // Enable JIT mode for better performance
    mode: 'jit',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: 'rgb(var(--mui-palette-primary-50, 247, 250, 255))',
                    100: 'rgb(var(--mui-palette-primary-100, 237, 245, 255))',
                    200: 'rgb(var(--mui-palette-primary-200, 221, 236, 255))',
                    300: 'rgb(var(--mui-palette-primary-300, 190, 219, 255))',
                    400: 'rgb(var(--mui-palette-primary-400, 148, 190, 255))',
                    500: 'rgb(var(--mui-palette-primary-mainChannel, 59, 130, 246))',
                    600: 'rgb(var(--mui-palette-primary-darkChannel, 37, 99, 235))',
                    700: 'rgb(var(--mui-palette-primary-700, 29, 78, 216))',
                    800: 'rgb(var(--mui-palette-primary-800, 30, 64, 175))',
                    900: 'rgb(var(--mui-palette-primary-900, 30, 58, 138))',
                    950: 'rgb(var(--mui-palette-primary-950, 23, 37, 84))',
                },
                secondary: {
                    50: 'rgb(var(--mui-palette-secondary-50, 248, 250, 252))',
                    100: 'rgb(var(--mui-palette-secondary-100, 241, 245, 249))',
                    200: 'rgb(var(--mui-palette-secondary-200, 226, 232, 240))',
                    300: 'rgb(var(--mui-palette-secondary-300, 203, 213, 225))',
                    400: 'rgb(var(--mui-palette-secondary-400, 148, 163, 184))',
                    500: 'rgb(var(--mui-palette-secondary-mainChannel, 100, 116, 139))',
                    600: 'rgb(var(--mui-palette-secondary-darkChannel, 71, 85, 105))',
                    700: 'rgb(var(--mui-palette-secondary-700, 51, 65, 85))',
                    800: 'rgb(var(--mui-palette-secondary-800, 30, 41, 59))',
                    900: 'rgb(var(--mui-palette-secondary-900, 15, 23, 42))',
                    950: 'rgb(var(--mui-palette-secondary-950, 2, 6, 23))',
                },
                surface: {
                    50: 'rgb(var(--mui-palette-grey-50, 249, 250, 251))',
                    100: 'rgb(var(--mui-palette-grey-100, 243, 244, 246))',
                    200: 'rgb(var(--mui-palette-grey-200, 229, 231, 235))',
                    300: 'rgb(var(--mui-palette-grey-300, 209, 213, 219))',
                    400: 'rgb(var(--mui-palette-grey-400, 156, 163, 175))',
                    500: 'rgb(var(--mui-palette-grey-500, 107, 114, 128))',
                },
                error: {
                    50: 'rgb(var(--mui-palette-error-50, 254, 242, 242))',
                    100: 'rgb(var(--mui-palette-error-100, 254, 226, 226))',
                    200: 'rgb(var(--mui-palette-error-200, 254, 202, 202))',
                    300: 'rgb(var(--mui-palette-error-300, 252, 165, 165))',
                    400: 'rgb(var(--mui-palette-error-400, 248, 113, 113))',
                    500: 'rgb(var(--mui-palette-error-mainChannel, 239, 68, 68))',
                    600: 'rgb(var(--mui-palette-error-darkChannel, 220, 38, 38))',
                    700: 'rgb(var(--mui-palette-error-700, 185, 28, 28))',
                    800: 'rgb(var(--mui-palette-error-800, 153, 27, 27))',
                    900: 'rgb(var(--mui-palette-error-900, 127, 29, 29))',
                },
                success: {
                    50: 'rgb(var(--mui-palette-success-50, 240, 253, 244))',
                    100: 'rgb(var(--mui-palette-success-100, 220, 252, 231))',
                    500: 'rgb(var(--mui-palette-success-mainChannel, 34, 197, 94))',
                    700: 'rgb(var(--mui-palette-success-darkChannel, 21, 128, 61))',
                },
                warning: {
                    50: 'rgb(var(--mui-palette-warning-50, 255, 251, 235))',
                    100: 'rgb(var(--mui-palette-warning-100, 254, 243, 199))',
                    500: 'rgb(var(--mui-palette-warning-mainChannel, 245, 158, 11))',
                    700: 'rgb(var(--mui-palette-warning-darkChannel, 180, 83, 9))',
                },
            },
            boxShadow: {
                sm: 'var(--mui-shadows-1)',
                DEFAULT: 'var(--mui-shadows-2)',
                md: 'var(--mui-shadows-4)',
                lg: 'var(--mui-shadows-8)',
                xl: 'var(--mui-shadows-16)',
                '2xl': 'var(--mui-shadows-24)',
            },
        },
    },
    plugins: [],
}

