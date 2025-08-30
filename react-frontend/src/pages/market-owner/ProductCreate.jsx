import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axios';
import {
    TextField, Button, Paper, Typography, Grid, CircularProgress, Alert, Box
} from '@mui/material';

export default function ProductCreate() {
    const navigate = useNavigate();
    const { marketUuid } = useContext(AuthContext);
    const [productData, setProductData] = useState({
        name: '',
        barcode: '',
        price: '',
        stock_quantity: '0',
        shelf_code: '',
        image: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
        formData.append('name', productData.name);
        formData.append('barcode', productData.barcode);
        formData.append('price', productData.price);
        formData.append('stock_quantity', productData.stock_quantity);
        formData.append('shelf_code', productData.shelf_code);
        if (productData.image) {
            formData.append('image', productData.image);
        }

        try {
            await axiosInstance.post(`/products/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/market-owner/products');
        } catch (err) {
            console.error("Failed to create product:", err);
            setError(err.response?.data?.message || 'Could not create product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Create New Product</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth required label="Product Name" name="name" value={productData.name} onChange={handleChange} /></Grid>
                    <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth required label="Barcode" name="barcode" value={productData.barcode} onChange={handleChange} /></Grid>
                    <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth required label="Price" name="price" type="number" value={productData.price} onChange={handleChange} /></Grid>
                    <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth required label="Stock Quantity" name="stock_quantity" type="number" value={productData.stock_quantity} onChange={handleChange} /></Grid>
                    <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth required label="Shelf Code" name="shelf_code" value={productData.shelf_code} onChange={handleChange} /></Grid>
                    <Grid size={{ xs: 12, sm: 6 }}><Button variant="contained" component="label">Upload Image<input type="file" hidden name="image" onChange={handleFileChange} /></Button></Grid>
                    {productData.image && <Grid size={{ xs: 12 }}><Typography>Selected: {productData.image.name}</Typography></Grid>}
                    <Grid size={{ xs: 12 }}>
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Create'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
}