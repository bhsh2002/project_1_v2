// src/pages/ScannerPage.jsx

import { useState, useMemo, useRef, useEffect } from 'react'; // <-- استيراد useRef و useEffect
import BarcodeScanner from '../components/BarcodeScanner';
import ProductDisplay from '../components/ProductDisplay';
import { fetchProductByBarcode } from '../api/productService';

// MUI Components
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog'; // <-- استبدال Drawer بـ Dialog
import Fade from '@mui/material/Fade'; // <-- لإضافة تأثير دخول ناعم

const ScannerPage = () => {
    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [scannerKey, setScannerKey] = useState(1); // <-- state جديد لإعادة تشغيل الماسح

    // useRef لتخزين هوية المؤقت للتحكم فيه
    const timerRef = useRef(null);

    const successAudio = useMemo(() => new Audio('/audio/scan-success.mp3'), []);

    // دالة إغلاق النافذة وإعادة تشغيل الماسح
    const handleCloseDialog = () => {
        setProductData(null);
        // مسح أي مؤقت موجود لمنع تشغيله بعد الإغلاق اليدوي
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        // تغيير الـ key لإجبار BarcodeScanner على إعادة التحميل
        setScannerKey(prevKey => prevKey + 1);
    };

    const handleScanSuccess = async (decodedText) => {
        if (isLoading) return;
        setIsLoading(true);
        setError(null);

        try {
            const product = await fetchProductByBarcode(decodedText);
            setProductData(product);
            successAudio.play();

            // ضبط المؤقت ليقوم بإغلاق النافذة بعد 3 ثوانٍ
            timerRef.current = setTimeout(() => {
                handleCloseDialog();
            }, 3000);

        } catch (err) {
            setError(err.message);
            // في حالة الخطأ، أعد تشغيل الماسح فورًا
            setScannerKey(prevKey => prevKey + 1);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setError(null);
        // أعد تشغيل الماسح أيضًا بعد إغلاق رسالة الخطأ
        setScannerKey(prevKey => prevKey + 1);
    };

    const isDialogOpen = Boolean(productData);
    const isSnackbarOpen = Boolean(error);

    // التأكد من مسح المؤقت عند تفكيك المكون
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);


    return (
        <Box sx={{ position: 'relative', width: '100%', height: '100%', flexGrow: 1 }}>

            <Box sx={{ width: '100%', maxWidth: '640px', mx: 'auto' }}>
                <Typography variant="h6" align="center" sx={{ mb: 2, color: 'text.secondary' }}>
                    وجه الكاميرا نحو الباركود
                </Typography>

                {/* استخدام key لإعادة التشغيل */}
                <BarcodeScanner
                    key={scannerKey}
                    onScanSuccess={handleScanSuccess}
                />
            </Box>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* استخدام Dialog لعرض المنتج */}
            <Dialog
                open={isDialogOpen}
                onClose={handleCloseDialog}
                TransitionComponent={Fade} // تأثير دخول ناعم
                PaperProps={{
                    style: {
                        borderRadius: 16, // استخدام الحواف الدائرية من الثيم
                    },
                }}
            >
                {/* لا نحتاج لعنوان منفصل، فالتصميم داخل ProductDisplay */}
                {productData && <ProductDisplay product={productData} onClose={handleCloseDialog} />}
            </Dialog>

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