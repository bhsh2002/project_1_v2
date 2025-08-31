import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { keyframes } from '@emotion/react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const qrcodeRegionId = "barcode-reader";

const scanningAnimation = keyframes`
  0% { top: 40%; }
  100% { top: 60%; }
`;

const BarcodeScanner = forwardRef(({ onScanSuccess, onScanFailure, onClose, onReady }, ref) => {
    const scannerRef = useRef(null);
    const [cameras, setCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState(null);
    const resumeTimeoutRef = useRef(null);
    const isTransitioningRef = useRef(false);

    useImperativeHandle(ref, () => ({
        resume: () => scannerRef.current?.resume(),
        pause: () => scannerRef.current?.pause(),
        stop: () => scannerRef.current?.stop()
    }));

    useEffect(() => {
        scannerRef.current = new Html5Qrcode(qrcodeRegionId);

        Html5Qrcode.getCameras()
            .then(devices => {
                if (devices && devices.length) {
                    setCameras(devices);
                    setSelectedCamera(devices[0].id);
                }
            })
            .catch(err => console.error("فشل في جلب الكاميرات:", err));

        return () => {
            if (scannerRef.current?.isScanning) {
                scannerRef.current.stop()
                    .catch(err => console.error("فشل إيقاف الماسح الضوئي:", err));
            }
            if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        if (!selectedCamera) return;

        const config = {
            fps: 10,
            qrbox: { width: 250, height: 150 },
            rememberLastUsedCamera: true,
            aspectRatio: 1.777,
            experimentalFeatures: {
                useBarCodeDetectorIfSupported: true
            }
        };

        scannerRef.current
            .start(
                { deviceId: { exact: selectedCamera } },
                config,
                (decodedText) => {
                    onScanSuccess(decodedText);
                    scannerRef.current.pause();
                },
                (errorMessage) => {
                    onScanFailure?.(errorMessage);

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
            )
            .then(() => { onReady?.(); })
            .catch(err => console.error("فشل بدء تشغيل الماسح الضوئي:", err));

        return () => {
            if (scannerRef.current?.isScanning) {
                scannerRef.current.stop()
                    .catch(err => console.error("فشل إيقاف الماسح الضوئي:", err));
            }
        };
    }, [selectedCamera]);

    return (
        <Box sx={{ position: 'relative', width: '100%', maxWidth: '600px', margin: 'auto', overflow: 'hidden' }}>
            <Box id={qrcodeRegionId} />

            {cameras.length > 1 && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="camera-select-label">اختر الكاميرا</InputLabel>
                    <Select
                        labelId="camera-select-label"
                        value={selectedCamera || ''}
                        onChange={(e) => setSelectedCamera(e.target.value)}
                    >
                        {cameras.map(cam => (
                            <MenuItem key={cam.id} value={cam.id}>
                                {cam.label || `كاميرا ${cam.id}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

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
