
import { useState } from 'react';
import {
    Box,
    Button,
    Paper,
    Typography,
    CircularProgress,
    Alert,
    Input
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axiosInstance from '../../api/axios';

export default function AppUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/vnd.android.package-archive') {
            setSelectedFile(file);
            setErrorMsg('');
        } else {
            setSelectedFile(null);
            setErrorMsg('الرجاء اختيار ملف APK صالح.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            setErrorMsg('الرجاء اختيار ملف أولاً.');
            return;
        }

        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        const formData = new FormData();
        formData.append('apk_file', selectedFile);

        try {
            const response = await axiosInstance.post('/app/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccessMsg(response.data.message || 'تم رفع الملف بنجاح!');
            setSelectedFile(null);
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'حدث خطأ أثناء رفع الملف.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>رفع تطبيق APK</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                سيؤدي رفع ملف APK جديد إلى استبدال الإصدار الحالي المتاح للتحميل.
            </Typography>

            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
            {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mb: 2 }}
                >
                    اختر ملف APK
                    <Input type="file" accept=".apk" hidden onChange={handleFileChange} />
                </Button>

                {selectedFile && (
                    <Typography sx={{ mb: 2 }}>
                        الملف المختار: {selectedFile.name}
                    </Typography>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || !selectedFile}
                    fullWidth
                >
                    {loading ? <CircularProgress size={24} /> : 'رفع التطبيق'}
                </Button>
            </Box>
        </Paper>
    );
}
