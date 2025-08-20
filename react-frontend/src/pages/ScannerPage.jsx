import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import ProductDisplay from '../components/ProductDisplay';
import { fetchProductByBarcode } from '../api/productService';
import { Html5Qrcode } from 'html5-qrcode';

// MUI Components
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import Slide from '@mui/material/Slide';

// --- (لا تغيير هنا) تعريف حركة خط المسح ---
const scannerLineAnimation = `
  @keyframes scanner-line-animation {
    0% { transform: translateY(0%); }
    100% { transform: translateY(calc(250px - 4px)); }
  }
`;
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = scannerLineAnimation;
document.head.appendChild(styleSheet);


const ScannerPage = () => {
    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isPanelOpen, setPanelOpen] = useState(false);

    const html5QrCodeRef = useRef(null);
    const successAudio = useMemo(() => new Audio('/audio/scan-success.mp3'), []);

    // تم تعريف الدوال التي لا تعتمد على دوال أخرى أولاً
    const stopScanner = useCallback(() => {
        if (html5QrCodeRef.current?.getState() === 2) { // 2 = SCANNING
            return html5QrCodeRef.current.stop();
        }
        return Promise.resolve();
    }, []);

    // تم تعريف handleScanSuccess هنا قبل startScanner لحل خطأ ReferenceError
    const handleScanSuccess = useCallback(async (decodedText) => {
        await stopScanner();
        setIsLoading(true);

        try {
            const product = await fetchProductByBarcode(decodedText);
            setProductData(product);
            setPanelOpen(true);
            successAudio.play();
        } catch (err) {
            setError(err.message); // في حالة الخطأ، سيتم إعادة تشغيل الماسح عند إغلاق Snackbar
        } finally {
            setIsLoading(false);
        }
    }, [stopScanner, successAudio]);

    const startScanner = useCallback(() => {
        // التأكد من عدم وجود نسخة تعمل بالفعل
        if (html5QrCodeRef.current?.getState() === 2) {
            return;
        }

        const qrCodeInstance = new Html5Qrcode('reader');
        html5QrCodeRef.current = qrCodeInstance;

        const config = { fps: 10, qrbox: { width: 250, height: 150 } };
        const successCallback = (decodedText) => handleScanSuccess(decodedText);

        qrCodeInstance.start({ facingMode: 'environment' }, config, successCallback)
            .catch(err => setError("لا يمكن الوصول إلى الكاميرا. يرجى التحقق من الأذونات وتحديث الصفحة."));
    }, [handleScanSuccess]);

    const handleClosePanel = useCallback(() => {
        setPanelOpen(false);
        setProductData(null);
        startScanner();
    }, [startScanner]);

    // دالة جديدة لإغلاق الخطأ وإعادة تشغيل الماسح
    const handleErrorClose = useCallback(() => {
        setError(null);
        startScanner();
    }, [startScanner]);

    useEffect(() => {
        startScanner();
        return () => {
            stopScanner();
        };
    }, [startScanner, stopScanner]);

    return (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: 'black' }}>
            {/* 1. طبقة الكاميرا */}
            <Box id="reader" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />

            {/* 2. طبقة مؤشر المسح (فوق الكاميرا) */}
            <Box sx={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                display: isPanelOpen || isLoading ? 'none' : 'flex',
                alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'
            }}>
                <Box sx={{
                    width: { xs: '80%', sm: '60%', md: '40%' },
                    height: '250px',
                    position: 'relative',
                }}>
                    <Box sx={{ position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTop: '4px solid white', borderLeft: '4px solid white', borderRadius: '8px 0 0 0' }} />
                    <Box sx={{ position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTop: '4px solid white', borderRight: '4px solid white', borderRadius: '0 8px 0 0' }} />
                    <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottom: '4px solid white', borderLeft: '4px solid white', borderRadius: '0 0 0 8px' }} />
                    <Box sx={{ position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottom: '4px solid white', borderRight: '4px solid white', borderRadius: '0 0 8px 0' }} />
                    <Box sx={{
                        position: 'absolute', top: 0, left: '5%', width: '90%', height: '4px',
                        bgcolor: '#f44336', boxShadow: '0 0 10px #f44336', borderRadius: '2px',
                        animation: 'scanner-line-animation 2s ease-in-out infinite alternate',
                    }} />
                </Box>
            </Box>

            {/* 3. طبقة التحميل */}
            <Backdrop open={isLoading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}>
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* 4. لوحة عرض المنتج */}
            <Slide direction="up" in={isPanelOpen} mountOnEnter unmountOnExit>
                <Box sx={{
                    position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: (theme) => theme.zIndex.drawer + 1,
                    borderTopLeftRadius: 20, borderTopRightRadius: 20,
                    background: 'rgba(28, 28, 30, 0.85)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    boxShadow: '0 -5px 20px rgba(0,0,0,0.2)',
                }}>
                    {productData && <ProductDisplay product={productData} onClose={handleClosePanel} />}
                </Box>
            </Slide>

            {/* 5. إشعار الخطأ (تم التعديل هنا) */}
            <Snackbar open={Boolean(error)} autoHideDuration={4000} onClose={handleErrorClose}>
                <Alert severity="error" variant="filled" sx={{ width: '100%' }}>{error}</Alert>
            </Snackbar>
        </Box>
    );
};

export default ScannerPage;