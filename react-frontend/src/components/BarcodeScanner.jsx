// src/components/BarcodeScanner.jsx

import { useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import Box from '@mui/material/Box';

const qrcodeRegionId = "barcode-reader";

const BarcodeScanner = ({ onScanSuccess, onScanFailure }) => {
    // ... (useEffect hook يبقى كما هو بدون تغيير)
    useEffect(() => {
        const html5QrcodeScanner = new Html5Qrcode(qrcodeRegionId);
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 150 },
            rememberLastUsedCamera: true,
        };
        const startScanner = () => {
            html5QrcodeScanner.start(
                { facingMode: "environment" },
                config,
                (decodedText, decodedResult) => {
                    html5QrcodeScanner.stop().then(() => {
                        onScanSuccess(decodedText, decodedResult);
                    });
                },
                (errorMessage) => {
                    if (onScanFailure) {
                        onScanFailure(errorMessage);
                    }
                }
            ).catch((err) => {
                console.error("Unable to start scanning.", err);
            });
        };
        startScanner();
        return () => {
            if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
                html5QrcodeScanner.stop()
                    .then(() => console.log("Barcode scanner stopped successfully."))
                    .catch((err) => console.error("Failed to stop the scanner.", err));
            }
        };
    }, [onScanSuccess, onScanFailure]);


    return (
        <Box
            sx={{
                width: '100%',
                position: 'relative',
                pt: '50%', // يحافظ على نسبة العرض إلى الارتفاع
                margin: 'auto',
                '& #barcode-reader': {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 2, // استخدام border radius من الثيم
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider'
                },
            }}
        >
            <Box id={qrcodeRegionId} />
        </Box>
    );
};

export default BarcodeScanner;