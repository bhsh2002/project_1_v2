
import { Box, Button, Paper, Typography, Container } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AndroidIcon from '@mui/icons-material/Android';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://price.savana.ly/back/api/v1';

export default function DownloadApp() {
    const handleDownload = () => {
        window.location.href = `${API_BASE_URL}/app/download`;
    };

    return (
        <Container maxWidth="sm">
            <Paper
                sx={{
                    mt: 8,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3
                }}
            >
                <AndroidIcon sx={{ fontSize: 80, color: 'success.main' }} />
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    تحميل تطبيق Sawemly
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center">
                    انقر على الزر أدناه لتحميل أحدث إصدار من تطبيقنا لنظام أندرويد.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                    sx={{ mt: 2, width: '100%', py: 2 }}
                >
                    تحميل الآن (.apk)
                </Button>
            </Paper>
        </Container>
    );
}
