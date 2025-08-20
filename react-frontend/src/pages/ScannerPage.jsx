import { useState, useEffect } from 'react';
import BarcodeScanner from '../components/BarcodeScanner';
// سنقوم بإنشاء هذين الملفين في الخطوات التالية
import ProductDisplay from '../components/ProductDisplay';
import { fetchProductByBarcode } from '../api/productService';

// MUI Components
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

const ScannerPage = () => {
    // --- إدارة الحالات ---
    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    // حالة منفصلة للتحكم في عرض الماسح بشكل صريح
    const [showScanner, setShowScanner] = useState(true);

    // --- المؤقت لإعادة تشغيل الماسح ---
    useEffect(() => {
        let timer;
        // إذا كان هناك منتج أو خطأ، ابدأ المؤقت
        if (productData || error) {
            timer = setTimeout(() => {
                handleReset();
            }, 3000); // 3 ثوانٍ
        }
        // دالة التنظيف: إلغاء المؤقت إذا تم تفكيك المكون
        return () => {
            clearTimeout(timer);
        };
    }, [productData, error]); // هذا الـ effect يعمل فقط عند تغير بيانات المنتج أو الخطأ

    // --- معالجة نجاح المسح ---
    const handleScanSuccess = async (decodedText) => {
        setShowScanner(false); // إخفاء الماسح فوراً
        setIsLoading(true);
        setError(null);
        setProductData(null);

        try {
            // استدعاء الـ API (المحاكي حالياً)
            const product = await fetchProductByBarcode(decodedText);
            setProductData(product);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // --- إعادة تعيين الحالة للبدء من جديد ---
    const handleReset = () => {
        setProductData(null);
        setError(null);
        setIsLoading(false);
        setShowScanner(true); // إعادة إظهار الماسح
    };

    // --- منطق العرض الشرطي ---
    const renderContent = () => {
        if (isLoading) {
            return <CircularProgress />;
        }
        if (error) {
            return <Alert severity="error">{error}</Alert>;
        }
        if (productData) {
            return <ProductDisplay product={productData} />;
        }
        if (showScanner) {
            return (
                <>
                    <Typography variant="h5" gutterBottom>
                        وجه الكاميرا نحو الباركود
                    </Typography>
                    <BarcodeScanner onScanSuccess={handleScanSuccess} />
                </>
            );
        }
        // حالة افتراضية (لا يجب أن تظهر عادةً)
        return null;
    };

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80vh' // لضمان وجود مساحة كافية
            }}
        >
            {renderContent()}
        </Box>
    );
};

export default ScannerPage;