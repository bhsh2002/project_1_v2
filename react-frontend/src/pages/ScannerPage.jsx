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

const SCAN_BOX_SIZE = 250;

const ScannerPage = () => {
    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isPanelOpen, setPanelOpen] = useState(false);

    const html5QrCodeRef = useRef(null);
    const isScanningRef = useRef(false);
    const isHandlingScanRef = useRef(false); // لمنع تكرار المعالجة على نفس القراءة
    const styleTagRef = useRef(null);

    const successAudio = useMemo(() => new Audio('/audio/scan-success.mp3'), []);

    // حقن أنيميشن خط المسح مرة واحدة مع تنظيف
    useEffect(() => {
        const scannerLineAnimation = `
      @keyframes scanner-line-animation {
        0% { transform: translateY(0%); }
        100% { transform: translateY(calc(${SCAN_BOX_SIZE}px - 4px)); }
      }
    `;
        const styleEl = document.createElement('style');
        styleEl.type = 'text/css';
        styleEl.appendChild(document.createTextNode(scannerLineAnimation));
        document.head.appendChild(styleEl);
        styleTagRef.current = styleEl;

        return () => {
            if (styleTagRef.current && styleTagRef.current.parentNode) {
                styleTagRef.current.parentNode.removeChild(styleTagRef.current);
            }
        };
    }, []);

    const stopScanner = useCallback(async () => {
        const inst = html5QrCodeRef.current;
        if (!inst || !isScanningRef.current) return;
        try {
            await inst.stop();
            await inst.clear();
        } catch {
            // تجاهل أي أخطاء عند الإيقاف/التنظيف
        } finally {
            isScanningRef.current = false;
        }
    }, []);

    const handleScanSuccess = useCallback(
        async (decodedText) => {
            // حارس لمنع الاستدعاء المتكرر أثناء المعالجة
            if (isHandlingScanRef.current) return;
            isHandlingScanRef.current = true;

            await stopScanner();
            setIsLoading(true);

            try {
                const product = await fetchProductByBarcode(decodedText);
                setProductData(product);
                setPanelOpen(true);

                // تشغيل صوت النجاح (قد يُرفض من المتصفح بدون تفاعل المستخدم)
                successAudio.play().catch(() => { });
            } catch (err) {
                setError(err?.message || 'حدث خطأ غير متوقع أثناء جلب المنتج.');
            } finally {
                setIsLoading(false);
                // بعد انتهاء العملية، اسمح بمحاولة مسح جديدة لاحقًا
                isHandlingScanRef.current = false;
            }
        },
        [stopScanner, successAudio]
    );

    const startScanner = useCallback(async () => {
        // لا تبدأ إن كان اللوح مفتوحًا أو هناك تحميل (نُخفي الكاميرا حينها)
        if (isPanelOpen || isLoading) return;

        // لا نُنشئ نسخة جديدة إن وُجدت
        if (!html5QrCodeRef.current) {
            html5QrCodeRef.current = new Html5Qrcode('reader');
        }

        // لو كان يعمل بالفعل، لا تُكرّر
        if (isScanningRef.current) return;

        try {
            // التأكد من سياق آمن (HTTPS) — مطلوب للوصول للكاميرا في المتصفحات
            if (!window.isSecureContext && window.location.hostname !== 'localhost') {
                setError('الوصول للكاميرا يتطلب اتصالًا آمنًا (HTTPS). افتح الصفحة عبر https أو استخدم localhost أثناء التطوير.');
                return;
            }

            const videoConstraints = { facingMode: 'environment' };
            const config = { fps: 10, qrbox: { width: SCAN_BOX_SIZE, height: SCAN_BOX_SIZE } };

            await html5QrCodeRef.current.start(
                videoConstraints,
                config,
                (decodedText /*, decodedResult */) => handleScanSuccess(decodedText),
        /* onError */() => {
                    // يمكن تجاهل أخطاء فك الترميز المتكررة لتحسين الأداء
                }
            );

            isScanningRef.current = true;
        } catch (e) {
            setError('لا يمكن الوصول إلى الكاميرا. تحقّق من الأذونات وجرّب تحديث الصفحة.');
            isScanningRef.current = false;
        }
    }, [handleScanSuccess, isPanelOpen, isLoading]);

    const handleClosePanel = useCallback(() => {
        setPanelOpen(false);
        setProductData(null);
        // بعد الإغلاق، نعيد تشغيل الماسح
        startScanner();
    }, [startScanner]);

    const handleErrorClose = useCallback(
        (_event, reason) => {
            if (reason === 'clickaway') return;
            setError(null);
            startScanner();
        },
        [startScanner]
    );

    useEffect(() => {
        // ابدأ الماسح عند التركيب
        startScanner();

        // تنظيف عند التفكيك
        return () => {
            (async () => {
                await stopScanner();
                html5QrCodeRef.current = null;
            })();
        };
    }, [startScanner, stopScanner]);

    return (
        <Box sx={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', bgcolor: 'black' }}>
            {/* 1. طبقة الكاميرا */}
            <Box
                id="reader"
                aria-label="كاميرا المسح"
                sx={{ width: '100%', height: '100%', '& video': { objectFit: 'cover', width: '100%', height: '100%' } }}
            />

            {/* 2. طبقة مؤشر المسح (فوق الكاميرا) */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    display: isPanelOpen || isLoading ? 'none' : 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                }}
            >
                <Box sx={{ width: { xs: '80%', sm: '60%', md: '40%' }, maxWidth: 420, height: `${SCAN_BOX_SIZE}px`, position: 'relative' }}>
                    {/* زوايا الإطار */}
                    <Box sx={{ position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTop: '4px solid white', borderLeft: '4px solid white', borderRadius: '8px 0 0 0' }} />
                    <Box sx={{ position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTop: '4px solid white', borderRight: '4px solid white', borderRadius: '0 8px 0 0' }} />
                    <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottom: '4px solid white', borderLeft: '4px solid white', borderRadius: '0 0 0 8px' }} />
                    <Box sx={{ position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottom: '4px solid white', borderRight: '4px solid white', borderRadius: '0 0 8px 0' }} />

                    {/* خط المسح */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: '5%',
                            width: '90%',
                            height: '4px',
                            bgcolor: '#f44336',
                            boxShadow: '0 0 10px #f44336',
                            borderRadius: '2px',
                            animation: 'scanner-line-animation 2s ease-in-out infinite alternate'
                        }}
                    />
                </Box>
            </Box>

            {/* 3. طبقة التحميل */}
            <Backdrop open={isLoading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}>
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* 4. لوحة عرض المنتج */}
            <Slide direction="up" in={isPanelOpen} mountOnEnter unmountOnExit>
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        borderTopLeftRadius: 2,
                        borderTopRightRadius: 2,
                        background: 'rgba(28, 28, 30, 0.85)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        boxShadow: '0 -5px 20px rgba(0,0,0,0.2)'
                    }}
                >
                    {productData && <ProductDisplay product={productData} onClose={handleClosePanel} />}
                </Box>
            </Slide>

            {/* 5. إشعار الخطأ */}
            <Snackbar open={Boolean(error)} autoHideDuration={4000} onClose={handleErrorClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ScannerPage;
