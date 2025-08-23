import { useEffect, useRef } from 'react';
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

const BarcodeScanner = ({ onScanSuccess, onScanFailure, onClose }) => {
    const scannerRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        scannerRef.current = new Html5Qrcode(qrcodeRegionId);
        const config = { fps: 10, qrbox: { width: 250, height: 150 }, rememberLastUsedCamera: true };

        scannerRef.current.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
                onScanSuccess(decodedText);
                scannerRef.current.pause();
                timerRef.current = setTimeout(() => scannerRef.current.resume(), 3500);
            },
            (errorMessage) => onScanFailure?.(errorMessage)
        ).catch(err => console.error("Scanner start failed:", err));

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (scannerRef.current?.isScanning) scannerRef.current?.stop().catch(err => console.error("Scanner stop failed:", err));
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
                aria-label="close scanner"
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
};

export default BarcodeScanner;
