import React from 'react';
import { Box, Container, Typography, Stack, IconButton } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

function Footer() {
    return (
        <Box component="footer" sx={{ py: 4, bgcolor: '#1c1917', color: 'white' }}>
            <Container sx={{ textAlign: 'center' }}>
                <Typography variant="body2">
                    &copy; {new Date().getFullYear()} ساوملي. جميع الحقوق محفوظة.
                </Typography>
                <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 2 }}>
                    <IconButton href="#" sx={{ color: 'white' }}><LinkIcon /></IconButton>
                    <IconButton href="#" sx={{ color: 'white' }}><FacebookIcon /></IconButton>
                    <IconButton href="#" sx={{ color: 'white' }}><InstagramIcon /></IconButton>
                </Stack>
            </Container>
        </Box>
    );
}

export default Footer;