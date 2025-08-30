import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, CircularProgress, Box, Alert, IconButton, TablePagination
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function ProductsList() {
    const { marketUuid } = useContext(AuthContext);
    const [data, setData] = useState({ items: [], pagination: { total: 0, page: 1, per_page: 10 } });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchProducts = (page = 1, limit = 10) => {
        if (marketUuid) {
            setLoading(true);
            axiosInstance.get(`/products/?market_uuid=${marketUuid}&page=${page}&per_page=${limit}`)
                .then(res => {
                    setData(res.data || { items: [], pagination: { total: 0, page: 1, per_page: 10 } });
                })
                .catch(err => {
                    console.error("Failed to fetch products:", err);
                    setError('تعذر تحميل المنتجات.');
                })
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        fetchProducts(data.pagination.page, data.pagination.per_page);
    }, [marketUuid, data.pagination.page, data.pagination.per_page]);

    const handleDelete = (productId) => {
        axiosInstance.delete(`/products/${productId}`)
            .then(() => fetchProducts(data.pagination.page, data.pagination.per_page))
            .catch(err => setError('فشل حذف المنتج.'));
    };

    const handleChangePage = (event, newPage) => {
        setData((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, page: newPage + 1 },
        }));
    };

    const handleChangeRowsPerPage = (event) => {
        setData((prev) => ({
            ...prev,
            pagination: {
                ...prev.pagination,
                per_page: parseInt(event.target.value, 10),
                page: 1,
            },
        }));
    };

    if (loading && !data.items.length) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    const headCellStyle = { fontWeight: 'bold', whitespace: 'nowrap' };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">المنتجات</Typography>
                <Button component={Link} to="/market-owner/products/new" variant="contained">
                    منتج جديد
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={headCellStyle}>#</TableCell>
                            <TableCell sx={headCellStyle}>الاسم</TableCell>
                            <TableCell sx={headCellStyle}>الباركود</TableCell>
                            <TableCell sx={headCellStyle}>السعر</TableCell>
                            <TableCell sx={headCellStyle}>المخزون</TableCell>
                            <TableCell sx={headCellStyle}>الإجراءات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={6} align="center"><CircularProgress /></TableCell></TableRow>
                        ) : data.items.length > 0 ? data.items.map((product, index) => (
                            <TableRow key={product.id}>
                                <TableCell sx={headCellStyle}>{(data.pagination.page - 1) * data.pagination.per_page + index + 1}</TableCell>
                                <TableCell sx={headCellStyle}>{product.name}</TableCell>
                                <TableCell sx={headCellStyle}>{product.barcode}</TableCell>
                                <TableCell sx={headCellStyle}>{product.price}</TableCell>
                                <TableCell sx={headCellStyle}>{product.stock_quantity}</TableCell>
                                <TableCell sx={{ ...headCellStyle, display: 'flex', gap: 1 }}>
                                    <IconButton component={Link} to={`/market-owner/products/${product.uuid}/edit`} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(product.uuid)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">لم يتم العثور على منتجات.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={data.pagination.total}
                    rowsPerPage={data.pagination.per_page}
                    page={data.pagination.page - 1}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </Box>
    );
}