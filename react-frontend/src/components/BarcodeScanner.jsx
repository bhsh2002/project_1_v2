import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { keyframes } from '@emotion/react';

const qrcodeRegionId = "barcode-reader";

const scanningAnimation = keyframes`
  0% { top: 40%; }
  100% { top: 60%; }
`;

const BarcodeScanner = forwardRef(({ onScanSuccess, onScanFailure, onClose, onReady }, ref) => {
    const scannerRef = useRef(null);

    useImperativeHandle(ref, () => ({
        resume: () => scannerRef.current?.resume(),
        pause: () => scannerRef.current?.pause(),
        stop: () => scannerRef.current?.stop()
    }));

    useEffect(() => {
        scannerRef.current = new Html5Qrcode(qrcodeRegionId);
        const config = { fps: 10, qrbox: { width: 250, height: 150 }, rememberLastUsedCamera: true };

        scannerRef.current.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
                onScanSuccess(decodedText);
                scannerRef.current.pause();
            },
            (errorMessage) => { onScanFailure?.(errorMessage); scannerRef.current?.resume() }
        ).then(() => { onReady?.(); }
        ).catch(err => { console.error("فشل بدء تشغيل الماسح الضوئي:", err); scannerRef.current?.resume() });

        return () => {
            if (scannerRef.current?.isScanning) scannerRef.current?.stop().catch(err => console.error("فشل إيقاف الماسح الضوئي:", err));
        };
    }, [onScanSuccess, onScanFailure]);

    return (
        <Box sx={{ position: 'relative', width: '100%', maxWidth: '600px', margin: 'auto', overflow: 'hidden' }}>
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