import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import BarcodeScanner from '../components/BarcodeScanner';
import ProductDisplay from '../components/ProductDisplay';
import { fetchProductByBarcode } from '../api/productService';

// MUI Components
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import Dialog from '@mui/material/Dialog';
import Fade from '@mui/material/Fade';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Typography from '@mui/material/Typography';

const ScannerPage = () => {
    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isScannerOpen, setScannerOpen] = useState(false);

    const timerRef = useRef(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Audio
    const successAudio = useMemo(() => new Audio('/audio/scan-success.mp3'), []);

    const handleOpenScanner = useCallback(() => setScannerOpen(true), []);
    const handleCloseScanner = useCallback(() => setScannerOpen(false), []);

    const handleResetScanner = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setProductData(null);
    }, []);

    const handleScanSuccess = useCallback(async (decodedText) => {
        setIsLoading(true);
        setError(null);
        try {
            const product = await fetchProductByBarcode(decodedText);
            setProductData(product);
            // Play success audio safely
            try { await successAudio.play(); } catch { }
            // Reset scanner after 3s
            timerRef.current = setTimeout(() => handleResetScanner(), 3000);
        } catch (err) {
            setError(err.message || 'Failed to fetch product');
        } finally {
            setIsLoading(false);
        }
    }, [successAudio, handleResetScanner]);

    const handleCloseSnackbar = useCallback(() => setError(null), []);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const isProductDialogOpen = Boolean(productData);
    const isSnackbarOpen = Boolean(error);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, p: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>قارئ سعر المنتجات</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '400px' }}>
                اضغط على الزر لبدء مسح الباركود الخاص بالمنتج.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '400px' }}>
                تأكد من منح الإذن لاستخدام الكاميرا عند الطلب.
            </Typography>

            <Button
                variant="contained"
                size="large"
                startIcon={<CameraAltIcon />}
                onClick={handleOpenScanner}
            >
                ابدأ المسح
            </Button>

            {/* --- Scanner Dialog --- */}
            <Dialog
                fullScreen={isMobile}
                open={isScannerOpen}
                onClose={handleCloseScanner}
                PaperProps={{ sx: { height: 'auto', width: "90vw" } }}
            >
                <BarcodeScanner
                    onScanSuccess={handleScanSuccess}
                    onClose={handleCloseScanner}
                />
                <Backdrop
                    sx={{ color: '#fff', zIndex: theme => theme.zIndex.tooltip + 1, position: 'absolute' }}
                    open={isLoading && isScannerOpen}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Dialog>

            {/* --- Product Display Dialog --- */}
            <Dialog
                open={isProductDialogOpen}
                onClose={handleResetScanner}
                TransitionComponent={Fade}
            >
                {productData && <ProductDisplay product={productData} onClose={handleResetScanner} />}
            </Dialog>

            {/* --- Error Snackbar --- */}
            <Snackbar
                open={isSnackbarOpen}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ScannerPage;
