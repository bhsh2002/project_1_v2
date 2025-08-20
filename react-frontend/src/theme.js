// src/theme.js
import { createTheme } from '@mui/material/styles';

// تعريف ثيم مخصص لتطبيقك
const theme = createTheme({
    palette: {
        mode: 'light', // يمكنك التبديل إلى 'dark' للوضع المظلم
        primary: {
            main: '#007BFF', // لون أزرق جذاب
        },
        secondary: {
            main: '#6c757d', // لون رمادي محايد
        },
        background: {
            default: '#f8f9fa', // خلفية رمادية فاتحة
            paper: '#ffffff', // لون الخلفيات الورقية (مثل البطاقات واللوح السفلي)
        },
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
        borderRadius: 12, // حواف دائرية أكثر نعومة
    },
    components: {
        // تخصيص شكل الـ Drawer (اللوح السفلي)
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                },
            },
        },
        // تخصيص شكل الـ AppBar (الشريط العلوي)
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: 'none', // إزالة الظل الافتراضي
                    borderBottom: '1px solid #e0e0e0', // إضافة حد سفلي رقيق
                },
            },
        },
        // تخصيص شكل التنبيهات
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