// src/theme.js
import { createTheme } from '@mui/material/styles';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from '@mui/stylis-plugin-rtl';

// Create rtl cache
export const rtlCache = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

const theme = createTheme({
    direction: 'rtl',
    palette: {
        // mode: 'dark', // Switched to dark mode for better camera contrast
        // primary: {
        //     main: '#3f51b5', // A vibrant blue for dark mode
        // },
        // secondary: {
        //     main: '#f50057', // A bright pink for accents
        // },
        // background: {
        //     default: '#121212', // Standard dark background
        //     paper: '#1E1E1E',   // Background for paper-like surfaces (Dialogs, Cards)
        // },
    },
    typography: {
        fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
        h4: {
            fontWeight: 700,
        },
        h6: {
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12, // Keep the softer border radius
    },
    components: {
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 16,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: ({ theme }) => ({
                    boxShadow: 'none',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }),
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
    },
});

export default theme;