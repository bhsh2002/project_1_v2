import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { CloudUpload, QrCodeScanner, PriceCheck } from '@mui/icons-material';

const steps = [
    { icon: '1️⃣', title: 'للمتجر: رفع البيانات', description: 'يقوم المتجر برفع ملف بسيط يحتوي على قائمة المنتجات والأسعار، ليتم تحديثها فورياً على المنصة السحابية.' },
    { icon: '2️⃣', title: 'للعميل: مسح الرمز', description: 'يقوم العميل بمسح رمز الـ QR الموجود على المنتجات باستخدام كاميرا هاتفه، دون الحاجة لتحميل أي تطبيق.' },
    { icon: '3️⃣', title: 'النتيجة: سعر فوري', description: 'تظهر شاشة بسيطة على هاتف العميل تعرض السعر، الوصف، وأي عروض خاصة للمنتج.' }
];

function HowItWorks() {
    return (
        <Box component="section" id="how-it-works" sx={{ py: 10, bgcolor: 'background.default' }}>
            <Container sx={{ textAlign: 'center' }}>
                <Typography variant="h3" component="h3" sx={{ mb: 2 }}>
                    كيف يعمل ساوملي؟
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 8, maxWidth: '600px', mx: 'auto' }}>
                    نقدم حلاً بسيطاً للمتاجر والعملاء على حد سواء. كل ما يتطلبه الأمر هو 3 خطوات سهلة.
                </Typography>
                <Grid container spacing={5}>
                    {steps.map((step, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Box>
                                <Typography variant="h1" sx={{ mb: 2, color: 'primary.main' }}>{step.icon}</Typography>
                                <Typography variant="h5" component="h4" sx={{ mb: 1 }}>{step.title}</Typography>
                                <Typography color="text.primary">{step.description}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

export default HowItWorks;