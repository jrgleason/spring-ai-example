/**
 * Main theme configuration for the application
 * This centralizes theme values for use in both Tailwind classes and JavaScript styling
 */

// MUI theme primary and secondary colors in hex format to avoid CSS var issues
const muiColors = {
    primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
        950: '#082f49',
    },
    secondary: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
        950: '#020617',
    },
    error: {
        50: '#fef2f2',
        100: '#fee2e2',
        500: '#ef4444',
        700: '#b91c1c',
    },
    success: {
        50: '#f0fdf4',
        100: '#dcfce7',
        500: '#22c55e',
        700: '#15803d',
    },
    surface: {
        50: '#ffffff',
        100: '#f9fafb',
        200: '#f3f4f6',
        300: '#e5e7eb',
        400: '#d1d5db',
        500: '#9ca3af',
    }
};

export const colors = {
    primary: {
        50: 'var(--color-primary-50)',
        100: 'var(--color-primary-100)',
        200: 'var(--color-primary-200)',
        300: 'var(--color-primary-300)',
        400: 'var(--color-primary-400)',
        500: 'var(--color-primary-500)',
        600: 'var(--color-primary-600)',
        700: 'var(--color-primary-700)',
        800: 'var(--color-primary-800)',
        900: 'var(--color-primary-900)',
        950: 'var(--color-primary-950)',
    },
    secondary: {
        50: 'var(--color-secondary-50)',
        100: 'var(--color-secondary-100)',
        200: 'var(--color-secondary-200)',
        300: 'var(--color-secondary-300)',
        400: 'var(--color-secondary-400)',
        500: 'var(--color-secondary-500)',
        600: 'var(--color-secondary-600)',
        700: 'var(--color-secondary-700)',
        800: 'var(--color-secondary-800)',
        900: 'var(--color-secondary-900)',
        950: 'var(--color-secondary-950)',
    },
    accent: {
        50: 'var(--color-accent-50)',
        100: 'var(--color-accent-100)',
        200: 'var(--color-accent-200)',
        300: 'var(--color-accent-300)',
        400: 'var(--color-accent-400)',
        500: 'var(--color-accent-500)',
        600: 'var(--color-accent-600)',
        700: 'var(--color-accent-700)',
        800: 'var(--color-accent-800)',
        900: 'var(--color-accent-900)',
        950: 'var(--color-accent-950)',
    },
    surface: {
        50: 'var(--color-surface-50)',
        100: 'var(--color-surface-100)',
        200: 'var(--color-surface-200)',
        300: 'var(--color-surface-300)',
        400: 'var(--color-surface-400)',
        500: 'var(--color-surface-500)',
    },
    error: {
        100: 'var(--color-error-100)',
        500: 'var(--color-error-500)',
        700: 'var(--color-error-700)',
    },
};

export const muiTheme = {
    components: {
        MuiButton: {
            styleOverrides: {
                containedPrimary: {
                    backgroundColor: colors.primary[600],
                    '&:hover': {
                        backgroundColor: colors.primary[700],
                    },
                },
                outlinedPrimary: {
                    borderColor: colors.primary[500],
                    color: colors.primary[600],
                    '&:hover': {
                        borderColor: colors.primary[700],
                        backgroundColor: colors.primary[50],
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.surface[50],
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.primary[600],
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    '&.Mui-checked': {
                        color: muiColors.primary[500],
                        '& + .MuiSwitch-track': {
                            backgroundColor: muiColors.primary[300],
                        },
                    },
                },
                track: {
                    backgroundColor: muiColors.secondary[300],
                },
            },
        },
    },
    palette: {
        primary: {
            main: muiColors.primary[500],
            light: muiColors.primary[300],
            dark: muiColors.primary[700],
            contrastText: muiColors.surface[50],
        },
        secondary: {
            main: muiColors.secondary[500],
            light: muiColors.secondary[300],
            dark: muiColors.secondary[700],
            contrastText: muiColors.secondary[50],
        },
        error: {
            main: muiColors.error[500],
            light: muiColors.error[100],
            dark: muiColors.error[700],
        },
        background: {
            default: muiColors.secondary[100],
            paper: muiColors.surface[50],
        },
        text: {
            primary: muiColors.secondary[900],
            secondary: muiColors.secondary[700],
        },
    },
    shape: {
        borderRadius: 8,
    },
};

export default {
    colors,
    muiTheme,
};
