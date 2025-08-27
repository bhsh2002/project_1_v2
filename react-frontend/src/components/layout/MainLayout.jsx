// src/components/layout/MainLayout.jsx

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CameraIcon from '@mui/icons-material/Camera';

const MainLayout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', bgcolor: 'background.default' }}>
            {/* سيستخدم AppBar الآن الألوان والأنماط من الثيم */}
            {/* <AppBar position="static" color="inherit">
                <Toolbar>
                    <CameraIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        ماسح الباركود
                    </Typography>
                </Toolbar>
            </AppBar> */}

            {/* منطقة المحتوى الرئيسي للصفحة */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    // p: { xs: 2, sm: 3 }, // زيادة الـ padding قليلًا
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