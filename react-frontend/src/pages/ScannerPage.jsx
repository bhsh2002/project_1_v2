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
import CartDialog from '../components/CartDialog';
import CartBar from '../components/CartBar';
import { Divider } from '@mui/material';
import { useParams } from 'react-router-dom';

const ScannerPage = () => {
    const { marketUuid } = useParams();
    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isScannerOpen, setScannerOpen] = useState(false);
    const [isScannerReady, setScannerReady] = useState(false);
    const [isCartOpen, setCartOpen] = useState(false);

    const scannerRef = useRef(null);
    const timerRef = useRef(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Audio
    const successAudio = useMemo(() => new Audio('/audio/scan-success.mp3'), []);
    const errorAudio = useMemo(() => new Audio('/audio/error.mp3'), []);

    const handleOpenScanner = useCallback(() => { setScannerOpen(true); setScannerReady(false); }, []);
    const handleCloseScanner = useCallback(() => { setScannerOpen(false); setScannerReady(false); }, []);

    const handleResetScanner = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setTimeout(() => {
            scannerRef.current?.resume();
        }, 500);
        setProductData(null);
    }, []);

    const handleScanSuccess = useCallback(async (decodedText) => {
        setIsLoading(true);
        setError(null);
        try {
            const product = await fetchProductByBarcode(marketUuid, decodedText);
            setProductData(product);
            // Play success audio safely
            if (Object.keys(product).length > 0)
                try { await successAudio.play(); } catch { }
            else
                try { await errorAudio.play(); } catch { }
            // Reset scanner after 3s
            timerRef.current = setTimeout(() => handleResetScanner(), 3000);
        } catch (err) {
            setError(err.message || 'فشل في جلب المنتج');
        } finally {
            setIsLoading(false);
        }
    }, [successAudio, errorAudio, handleResetScanner]);

    const handleCloseSnackbar = useCallback(() => setError(null), []);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const isProductDialogOpen = Boolean(productData);
    const isSnackbarOpen = Boolean(error);

    return (
        <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: "5rem" }}>
                {!isScannerOpen && <CartBar onOpenCart={() => setCartOpen(true)} />}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, p: 3, textAlign: 'center' }}>

                <Typography variant="h4" gutterBottom>مرحبا بك في سوق عكاظ</Typography>
                <Divider sx={{ width: '80px', mb: 10, borderBottomWidth: 3, borderColor: 'primary.main', mx: 'auto' }} />
                <Typography variant="h4" color='primary' gutterBottom>ساوملي</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '400px' }}>
                    اضغط الزر للبدء.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2, maxWidth: '400px' }}>
                    قم بتوجيه الكاميرا نحو باركود المنتج.
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
                    PaperProps={{ sx: { height: 'auto', width: "90vw", position: "relative" } }}
                >
                    <CartBar onOpenCart={() => setCartOpen(true)} />

                    {/* الـ Scanner دايمًا موجود */}
                    <BarcodeScanner
                        ref={scannerRef}
                        onScanSuccess={handleScanSuccess}
                        onClose={handleCloseScanner}
                        onReady={() => setScannerReady(true)} // يستدعى من داخل BarcodeScanner
                    />

                    {/* Overlay التحميل */}
                    {!isScannerReady && (
                        <Backdrop
                            open
                            sx={{
                                bgcolor: "#fff",
                                zIndex: theme => theme.zIndex.drawer + 1,
                                position: 'absolute'
                            }}
                        >
                            <CircularProgress color="inherit" />
                            <Typography sx={{ mt: 2 }}>جاري تشغيل الكاميرا...</Typography>
                        </Backdrop>
                    )}
                </Dialog>

                {/* --- Product Display Dialog --- */}
                <Dialog
                    open={isProductDialogOpen}
                    onClose={handleResetScanner}
                    TransitionComponent={Fade}
                >
                    {productData && <ProductDisplay product={productData} onClose={handleResetScanner} />}
                </Dialog>

                {/* --- Cart Dialog --- */}
                <CartDialog open={isCartOpen} onClose={() => setCartOpen(false)} />

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
        </Box>
    );
};

export default ScannerPage;