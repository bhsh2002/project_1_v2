import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { keyframes } from '@emotion/react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const qrcodeRegionId = "barcode-reader";

const scanningAnimation = keyframes`
  0% { top: 40%; }
  100% { top: 60%; }
`;

function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

const BarcodeScanner = forwardRef(({ onScanSuccess, onScanFailure, onClose, onReady }, ref) => {
    const scannerRef = useRef(null);
    const [fallbackMode, setFallbackMode] = useState(false);
    const [failCount, setFailCount] = useState(0);
    const resumeTimeoutRef = useRef(null);
    const isTransitioningRef = useRef(false);

    useImperativeHandle(ref, () => ({
        resume: () => scannerRef.current?.resume(),
        pause: () => scannerRef.current?.pause(),
        stop: () => scannerRef.current?.stop()
    }));

    // تشغيل الماسح
    const startScanner = () => {
        if (!scannerRef.current) {
            scannerRef.current = new Html5Qrcode(qrcodeRegionId);
        }

        const config = {
            fps: 10,
            qrbox: { width: 250, height: 150 },
            aspectRatio: 1.777,
            rememberLastUsedCamera: true,
            experimentalFeatures: {
                useBarCodeDetectorIfSupported: true
            }
        };

        scannerRef.current.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
                onScanSuccess(decodedText);
                scannerRef.current.pause();
            },
            (errorMessage) => {
                onScanFailure?.(errorMessage);

                setFailCount(prev => {
                    const newCount = prev + 1;
                    if (isIOS() && newCount > 5) {
                        setFallbackMode(true);
                        scannerRef.current.stop()
                            .catch(err => console.error("فشل إيقاف الماسح:", err));
                    }
                    return newCount;
                });

                if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
                resumeTimeoutRef.current = setTimeout(async () => {
                    if (scannerRef.current && !isTransitioningRef.current) {
                        try {
                            isTransitioningRef.current = true;
                            if (!scannerRef.current.isScanning) {
                                await scannerRef.current.resume();
                            }
                        } catch (err) {
                            console.warn("Resume فشل:", err);
                        } finally {
                            isTransitioningRef.current = false;
                        }
                    }
                }, 800);
            }
        ).then(() => { onReady?.(); })
            .catch(err => {
                console.error("فشل بدء تشغيل الماسح:", err);
                if (isIOS()) setFallbackMode(true);
            });
    };

    useEffect(() => {
        if (!fallbackMode) {
            startScanner();
        }

        return () => {
            if (scannerRef.current?.isScanning) {
                scannerRef.current.stop()
                    .catch(err => console.error("فشل إيقاف الماسح:", err));
            }
            if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
        };
    }, [fallbackMode]);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file || !scannerRef.current) return;

        try {
            const result = await scannerRef.current.scanFile(file, true);
            onScanSuccess(result);
        } catch (err) {
            onScanFailure?.(err);
        }
    };

    return (
        <Box sx={{ position: 'relative', width: '100%', maxWidth: '600px', margin: 'auto', overflow: 'hidden' }}>
            {!fallbackMode ? (
                <>
                    <Box id={qrcodeRegionId} />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 'calc(50% - 75px)',
                            left: '20%',
                            width: '60%',
                            height: '2px',
                            background: theme => `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
                            boxShadow: theme => `0 0 10px ${theme.palette.primary.main}`,
                            animation: `${scanningAnimation} 1s infinite alternate ease-in-out`,
                            transform: 'translateY(-50%)'
                        }}
                    />
                </>
            ) : (
                <Box sx={{ textAlign: 'center', p: 3 }}>
                    <p>قم بالتقاط صورة للباركود:</p>
                    <Button variant="contained" component="label">
                        التقط صورة
                        <input type="file" accept="image/*" hidden onChange={handleFileUpload} />
                    </Button>
                </Box>
            )}

            {/* أزرار التحكم في الوضع */}
            <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: "center" }}>
                <Button
                    variant={!fallbackMode ? "contained" : "outlined"}
                    onClick={() => setFallbackMode(false)}
                >
                    الكاميرا
                </Button>
                <Button
                    variant={fallbackMode ? "contained" : "outlined"}
                    onClick={() => setFallbackMode(true)}
                >
                    رفع صورة
                </Button>
            </Stack>

            <IconButton
                aria-label="إغلاق الماسح الضوئي"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
                }}
            >
                <CloseIcon />
            </IconButton>
        </Box>
    );
});

export default BarcodeScanner;
