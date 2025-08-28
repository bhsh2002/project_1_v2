import React from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';

function Hero() {
    return (
        <Box component="section" id="hero" sx={{ bgcolor: 'grey.50', minHeight: '100vh', display: 'flex', alignItems: 'center', pt: 12, pb: 6 }}>
            <Container sx={{ textAlign: 'center' }}>
                <Typography variant="h1" component="h2" color="primary"
                    sx={{ mb: 2, fontSize: { xs: '3.5rem', md: '5rem' } }}>
                    امسح، تسوق، وفر.
                </Typography>
                <Typography variant="h5" component="p" color="text.secondary"
                    sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
                    أحدث ثورة في تجربة التسوق في متجرك. قل وداعاً لطوابير قارئات الأسعار القديمة.
                </Typography>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    justifyContent="center"
                >
                    <Button variant="contained" size="large" href="#contact" sx={{ px: 4, py: 1.5 }}>
                        ابدأ الآن لمتجرك
                    </Button>
                    <Button variant="outlined" size="large" href="#benefits" sx={{ px: 4, py: 1.5 }}>
                        اكتشف المزيد
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
}

export default Hero;