import { useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import Box from '@mui/material/Box';

// معرف فريد للعنصر الذي سيعرض الكاميرا
const qrcodeRegionId = "barcode-reader";

const BarcodeScanner = ({ onScanSuccess, onScanFailure }) => {
    useEffect(() => {
        // نقوم بإنشاء كائن الماسح مرة واحدة عند تحميل المكون
        const html5QrcodeScanner = new Html5Qrcode(qrcodeRegionId);

        const config = {
            fps: 10, // عدد الإطارات في الثانية للمسح
            qrbox: { width: 250, height: 150 }, // حجم مربع التوجيه للمسح
            rememberLastUsedCamera: true, // تذكر آخر كاميرا تم استخدامها
        };

        // دالة لبدء تشغيل الماسح
        const startScanner = () => {
            html5QrcodeScanner.start(
                { facingMode: "environment" }, // تفضيل الكاميرا الخلفية في الهواتف
                config,
                (decodedText, decodedResult) => {
                    // هذه الدالة تُستدعى عند نجاح المسح
                    // أوقف الماسح فوراً لتجنب عمليات مسح متعددة
                    html5QrcodeScanner.stop().then(() => {
                        onScanSuccess(decodedText, decodedResult);
                    });
                },
                (errorMessage) => {
                    // هذه الدالة تُستدعى عند فشل المسح في إطار معين (يمكن تجاهلها)
                    if (onScanFailure) {
                        onScanFailure(errorMessage);
                    }
                }
            ).catch((err) => {
                console.error("Unable to start scanning.", err);
            });
        };

        startScanner();

        // ---- هذا هو الجزء الأكثر أهمية ----
        // دالة التنظيف (Cleanup Function) التي تعمل عند إخفاء المكون
        return () => {
            // نتأكد من أن الماسح يعمل قبل محاولة إيقافه لتجنب الأخطاء
            if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
                html5QrcodeScanner.stop()
                    .then(() => console.log("Barcode scanner stopped successfully."))
                    .catch((err) => console.error("Failed to stop the scanner.", err));
            }
        };
    }, [onScanSuccess, onScanFailure]); // تعتمد على هذه الدوال لضمان تحديثها

    return (
        <Box
            id={qrcodeRegionId}
            sx={{
                width: '100%',
                maxWidth: '600px',
                border: '2px solid #eee',
                borderRadius: 2,
                overflow: 'hidden',
                margin: 'auto',
            }}
        />
    );
};

export default BarcodeScanner;