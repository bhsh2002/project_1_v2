import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import {
    Box, Paper, Typography, Grid, TextField, Button
} from '@mui/material';

export default function QrCodeGenerator() {
    const { marketUuid } = useContext(AuthContext);
    const [settings, setSettings] = useState({
        url: `https://price.savana.ly/${marketUuid || ''}`,
        cols: 3,
        rows: 8,
        margin_x: 10,
        margin_y: 30,
        spacing_x: 100,
        spacing_y: 10,
    });

    const [pdfUrl, setPdfUrl] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const generateUrl = () => {
        const params = new URLSearchParams(settings);
        return `https://price.savana.ly/back/api/v1/markets/generate_qr_pdf?${params.toString()}`;
    };

    const handlePreview = () => {
        setPdfUrl(generateUrl());
    };

    const handlePrint = () => {
        const iframe = document.getElementById('pdf-preview');
        if (iframe) {
            iframe.contentWindow.print();
        }
    };

    // Generate preview on initial load
    useEffect(() => {
        if (marketUuid) { // Ensure marketUuid is available before generating URL
            handlePreview();
        }
    }, [marketUuid]);

    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>إعدادات الطباعة</Typography>
                    <Grid container spacing={2}>
                        <Grid item size={{ xs: 12 }}><TextField fullWidth label="الرابط" name="url" value={settings.url} onChange={handleChange} /></Grid>
                        <Grid item size={{ xs: 6 }}><TextField fullWidth label="أعمدة" name="cols" type="number" value={settings.cols} onChange={handleChange} /></Grid>
                        <Grid item size={{ xs: 6 }}><TextField fullWidth label="صفوف" name="rows" type="number" value={settings.rows} onChange={handleChange} /></Grid>
                        <Grid item size={{ xs: 6 }}><TextField fullWidth label="هامش أفقي" name="margin_x" type="number" value={settings.margin_x} onChange={handleChange} /></Grid>
                        <Grid item size={{ xs: 6 }}><TextField fullWidth label="هامش عمودي" name="margin_y" type="number" value={settings.margin_y} onChange={handleChange} /></Grid>
                        <Grid item size={{ xs: 6 }}><TextField fullWidth label="تباعد أفقي" name="spacing_x" type="number" value={settings.spacing_x} onChange={handleChange} /></Grid>
                        <Grid item size={{ xs: 6 }}><TextField fullWidth label="تباعد عمودي" name="spacing_y" type="number" value={settings.spacing_y} onChange={handleChange} /></Grid>
                        <Grid item size={{ xs: 12 }}>
                            <Button variant="contained" onClick={handlePreview} sx={{ mr: 1 }}>معاينة</Button>
                            <Button variant="outlined" onClick={handlePrint} disabled={!pdfUrl}>طباعة</Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
                <Paper sx={{ height: '80dvh', p: 1 }}>
                    {pdfUrl ? (
                        <iframe
                            id="pdf-preview"
                            src={pdfUrl}
                            title="QR Code PDF Preview"
                            width="100%"
                            height="100%"
                            style={{ border: 'none' }}
                        />
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <Typography>انقر على 'معاينة' لإنشاء ملف PDF.</Typography>
                        </Box>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
}