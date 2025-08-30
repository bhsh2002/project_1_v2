// MarketsList.jsx

import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, CircularProgress, Box,
    Alert
} from '@mui/material';
import { Link } from 'react-router-dom';

export default function MarketsList() {
    const [markets, setMarkets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(''); // إضافة حالة للخطأ

    const fetchMarkets = async () => {
        try {
            const response = await axiosInstance.get('/markets/');
            setMarkets(response.data.items || []);
        } catch (error) {
            console.error(error);
            setErrorMsg('Failed to fetch markets'); // تحديث رسالة الخطأ
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarkets();
    }, []);

    if (loading) return <CircularProgress />;

    // تم إضافة هذه الخاصية لتطبيقها على خلايا الرأس
    const headCellStyle = {
        whiteSpace: 'nowrap', // منع التفاف النص
        fontWeight: 'bold', // جعل الخط عريضًا للتميز
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Markets</Typography>
            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>} {/* عرض الخطأ */}
            <Button component={Link} to="/admin/markets/new" variant="contained" sx={{ mb: 2 }}>
                New Market
            </Button>
            <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={headCellStyle}>ID</TableCell>
                            <TableCell sx={headCellStyle}>Name</TableCell>
                            <TableCell sx={headCellStyle}>Owner</TableCell>
                            <TableCell sx={headCellStyle}>Phone Number</TableCell>
                            <TableCell sx={headCellStyle}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {markets.length > 0 ? (
                            markets.map((market) => (
                                <TableRow key={market.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>{market.id}</TableCell>
                                    <TableCell>{market.name}</TableCell>
                                    <TableCell>{market.owner?.email || '-'}</TableCell>
                                    <TableCell>{market.phone_number || '-'}</TableCell>
                                    <TableCell>
                                        <Button component={Link} to={`/admin/markets/${market.uuid}`} size="small" variant="outlined">
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography>No markets found.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}