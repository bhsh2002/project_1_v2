import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CameraIcon from '@mui/icons-material/Camera';

// هذا المكون سيستقبل "الأبناء" (الصفحات) ويعرضهم داخل الهيكل
const MainLayout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <CameraIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        ماسح الباركود
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* منطقة المحتوى الرئيسي للصفحة */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 1, sm: 2, md: 3 }, // Padding متجاوب مع حجم الشاشة
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default MainLayout;