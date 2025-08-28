import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';

function Contact() {
    return (
        <Box component="section" id="contact" sx={{ py: 10, bgcolor: 'grey.100' }}>
            <Container sx={{ textAlign: 'center' }}>
                <Typography variant="h3" component="h3" sx={{ mb: 2 }}>
                    جاهز للبدء؟
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
                    انضم إلى شبكة المتاجر الذكية. تواصل معنا اليوم لتحويل تجربة التسوق.
                </Typography>
                <Button variant="contained" size="large" href="#contact-details" sx={{ px: 4, py: 1.5 }}>
                    تواصل معنا الآن
                </Button>
            </Container>
        </Box>
    );
}

export default Contact;