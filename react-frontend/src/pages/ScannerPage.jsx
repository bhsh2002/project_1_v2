import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const ScannerPage = () => {
    return (
        <Box sx={{ textAlign: 'center', width: '100%' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Barcode Scanner
            </Typography>
            <Typography variant="body1">
                Scanner will be displayed here.
            </Typography>
        </Box>
    );
};

export default ScannerPage;