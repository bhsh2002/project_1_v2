import { useState, useMemo } from 'react';
import BarcodeScanner from '../components/BarcodeScanner';
import ProductDisplay from '../components/ProductDisplay';
import { fetchProductByBarcode } from '../api/productService';

// MUI Components for the new design
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Drawer from '@mui/material/Drawer';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';

const ScannerPage = () => {
    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- إعداد مشغل الصوت ---
    // نستخدم useMemo لضمان إنشاء كائن الصوت مرة واحدة فقط
    const successAudio = useMemo(() => new Audio('/audio/scan-success.mp3'), []);

    // --- معالجة نجاح المسح ---
    const handleScanSuccess = async (decodedText) => {
        // لا تفعل شيئاً إذا كان هناك طلب قيد التنفيذ بالفعل
        if (isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            const product = await fetchProductByBarcode(decodedText);
            setProductData(product);
            successAudio.play(); // تشغيل الصوت عند النجاح
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // --- دوال التحكم في إغلاق العناصر ---
    const handleCloseDrawer = () => {
        setProductData(null);
    };

    const handleCloseSnackbar = () => {
        setError(null);
    };

    // -- `productData` يحدد ما إذا كان اللوح السفلي مفتوحًا أم لا
    const isDrawerOpen = Boolean(productData);
    // -- `error` يحدد ما إذا كان الإشعار مفتوحًا أم لا
    const isSnackbarOpen = Boolean(error);

    return (
        <Box sx={{ position: 'relative', width: '100%', height: '100%', flexGrow: 1 }}>

            {/* الماسح دائمًا في الخلفية */}
            <Box sx={{
                width: '100%',
                maxWidth: '640px', // تحديد عرض أقصى على الشاشات الكبيرة
                mx: 'auto', // توسيط أفقي
            }}>
                <Typography variant="h6" align="center" sx={{ mb: 2, color: 'text.secondary' }}>
                    وجه الكاميرا نحو الباركود
                </Typography>
                <BarcodeScanner onScanSuccess={handleScanSuccess} />
            </Box>

            {/* طبقة التحميل فوق الماسح */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* اللوح السفلي لعرض المنتج */}
            <Drawer
                anchor="bottom"
                open={isDrawerOpen}
                onClose={handleCloseDrawer}
                sx={{
                    '& .MuiDrawer-paper': {
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        height: 'auto',
                        maxHeight: '70%', // لا تجعله يغطي الشاشة كلها
                    },
                }}
            >
                {/* نمرر دالة الإغلاق للمكون الداخلي */}
                {productData && <ProductDisplay product={productData} onClose={handleCloseDrawer} />}
            </Drawer>

            {/* إشعار الخطأ */}
            <Snackbar
                open={isSnackbarOpen}
                autoHideDuration={4000} // يختفي بعد 4 ثوانٍ
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