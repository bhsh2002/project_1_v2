// src/components/BarcodeScanner.jsx

import { useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { keyframes } from '@emotion/react';

const qrcodeRegionId = "barcode-reader";

// Define the scanning animation using keyframes
const scanningAnimation = keyframes`
  0% {
    top: 0;
  }
  100% {
    top: 100%;
  }
`;

const BarcodeScanner = ({ onScanSuccess, onScanFailure, onClose }) => {
    useEffect(() => {
        const html5QrcodeScanner = new Html5Qrcode(qrcodeRegionId);
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 150 },
            rememberLastUsedCamera: true,
        };

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

        return () => {
            if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
                html5QrcodeScanner.stop()
                    .catch((err) => console.error("Failed to stop the scanner.", err));
            }
        };
    }, [onScanSuccess, onScanFailure]);

    return (
        <Box sx={{ position: 'relative', width: '100%', maxWidth: '600px', margin: 'auto', overflow: 'hidden' }}>
            {/* The element for the video stream */}
            <Box id={qrcodeRegionId} />

            {/* Viewfinder Overlay */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    boxShadow: 'inset 0 0 0 9999px rgba(0, 0, 0, 0.6)',
                    '&::before, &::after': {
                        content: '""',
                        position: 'absolute',
                        width: 'calc(100% - 40px)', // Adjust size of the clear box
                        height: 'calc(50% - 95px)', // (250 / 2) - some padding
                        left: '20px',
                        right: '20px',
                        background: 'transparent',
                        border: '2px solid white'
                    },
                    '&::before': {
                        top: '20px',
                        borderBottom: 'none',
                    },
                    '&::after': {
                        bottom: '20px',
                        borderTop: 'none',
                    },
                }}
            />

            {/* Animated Laser Line */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 'calc(50% - 75px)', // Start at the top of the qrbox
                    left: '10%',
                    width: '80%',
                    height: '2px',
                    background: (theme) => `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
                    boxShadow: (theme) => `0 0 10px ${theme.palette.primary.main}`,
                    animation: `${scanningAnimation} 2s infinite alternate ease-in-out`,
                    transform: 'translateY(-50%)' // Center it on the animation path
                }}
            />

            {/* Close Button */}
            <IconButton
                aria-label="close scanner"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.6)'
                    }
                }}
            >
                <CloseIcon />
            </IconButton>
        </Box>
    );
};

export default BarcodeScanner;