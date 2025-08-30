import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axios';
import {
    Button, Typography, CircularProgress, Box, Alert, Paper, List, ListItem, ListItemText, Divider
} from '@mui/material';

export default function BulkUpload() {
    const { marketUuid } = useContext(AuthContext);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setResult(null);
        setError('');
    };

    const handleUpload = async () => {
        if (!file) {
            setError('الرجاء اختيار ملف للرفع.');
            return;
        }
        setUploading(true);
        setError('');
        setResult(null);

        const formData = new FormData();
        formData.append('product_file', file);

        try {
            const res = await axiosInstance.post(`/products/${marketUuid}/bulk-upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setResult(res.data);
        } catch (err) {
            console.error("Upload failed:", err);
            setError(err.response?.data?.message || 'فشل الرفع. الرجاء التحقق من صيغة الملف.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>رفع جماعي للمنتجات</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                قم برفع ملف CSV أو Excel بالأعمدة التالية: barcode, name, price, stock_quantity, shelf_code.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Button variant="contained" component="label">
                    اختر ملف
                    <input type="file" hidden onChange={handleFileChange} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                </Button>
                {file && <Typography>{file.name}</Typography>}
            </Box>
            <Button onClick={handleUpload} variant="contained" color="primary" disabled={uploading || !file}>
                {uploading ? <CircularProgress size={24} /> : 'رفع ومعالجة'}
            </Button>

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

            {result && (
                <Box sx={{ mt: 3 }}>
                    <Alert severity="success">{result.message}</Alert>
                    <List>
                        <ListItem><ListItemText primary={`تم الإنشاء: ${result.created_count}`} /></ListItem>
                        <Divider />
                        <ListItem><ListItemText primary={`تم التحديث: ${result.updated_count}`} /></ListItem>
                        <Divider />
                        <ListItem><ListItemText primary={`أخطاء: ${result.errors_count}`} /></ListItem>
                    </List>
                    {result.errors?.length > 0 && (
                        <Paper variant="outlined" sx={{ p: 1, mt: 1, maxHeight: 200, overflow: 'auto' }}>
                            <Typography variant="subtitle2">تفاصيل الأخطاء:</Typography>
                            <List dense>
                                {result.errors.map((err, i) => (
                                    <ListItem key={i}><ListItemText primary={`صف ${err.row_number}: ${err.error_message}`} /></ListItem>
                                ))}
                            </List>
                        </Paper>
                    )}
                </Box>
            )}
        </Paper>
    );
}