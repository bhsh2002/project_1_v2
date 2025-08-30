import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axios';
import {
    TextField, Button, Paper, Typography, Grid, CircularProgress, Alert, Box
} from '@mui/material';

export default function ProductEdit() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { marketUuid } = useContext(AuthContext);
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axiosInstance.get(`/products/${productId}`)
            .then(res => {
                setProductData(res.data);
            })
            .catch(err => {
                console.error("Failed to fetch product:", err);
                setError("تعذر تحميل بيانات المنتج.");
            })
            .finally(() => setLoading(false));
    }, [productId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setProductData(prev => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        Object.keys(productData).forEach(key => {
            if (key !== 'image') {
                formData.append(key, productData[key]);
            }
        });
        if (productData.image instanceof File) {
            formData.append('image', productData.image);
        }

        try {
            await axiosInstance.patch(`/products/${productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/market-owner/products');
        } catch (err) {
            console.error("Failed to update product:", err);
            setError(err.response?.data?.message || 'تعذر تحديث المنتج.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!productData) return <Typography>المنتج غير موجود.</Typography>;

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>تعديل المنتج</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth required label="اسم المنتج" name="name" value={productData.name} onChange={handleChange} /></Grid>
                    <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth required label="الباركود" name="barcode" value={productData.barcode} onChange={handleChange} /></Grid>
                    <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth required label="السعر" name="price" type="number" value={productData.price} onChange={handleChange} /></Grid>
                    <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth required label="الكمية في المخزون" name="stock_quantity" type="number" value={productData.stock_quantity} onChange={handleChange} /></Grid>
                    <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth required label="رمز الرف" name="shelf_code" value={productData.shelf_code} onChange={handleChange} /></Grid>
                    <Grid size={{ xs: 12, sm: 6 }}><Button variant="contained" component="label">رفع صورة<input type="file" hidden name="image" onChange={handleFileChange} /></Button></Grid>
                    {productData.image && <Grid size={{ xs: 12 }}><Typography>تم اختيار: {productData.image.name}</Typography></Grid>}
                    <Grid size={{ xs: 12 }}>
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'حفظ التغييرات'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
}