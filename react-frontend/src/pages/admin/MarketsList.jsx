import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, CircularProgress, Box, Alert, TablePagination
} from '@mui/material';
import { Link } from 'react-router-dom';
import { whitespace } from 'stylis';

export default function MarketsList() {
    const [data, setData] = useState({ items: [], pagination: { total: 0, page: 1, per_page: 10 } });
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const fetchMarkets = async (page = 1, limit = 10) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/markets/?page=${page}&per_page=${limit}`);
            setData(response.data || { items: [], pagination: { total: 0, page: 1, per_page: 10 } });
        } catch (error) {
            console.error(error);
            setErrorMsg('Failed to fetch markets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarkets(data.pagination.page, data.pagination.per_page);
    }, [data.pagination.page, data.pagination.per_page]);

    const handleChangePage = (event, newPage) => {
        setData(prev => ({ ...prev, page: newPage + 1 }));
    };

    const handleChangeRowsPerPage = (event) => {
        setData(prev => ({ ...prev, per_page: parseInt(event.target.value, 10), page: 1 }));
    };

    if (loading && !data.items.length) return <CircularProgress />;

    const headCellStyle = { fontWeight: 'bold', whitespace: 'nowrap' };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Markets</Typography>
            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
            <Button component={Link} to="/admin/markets/new" variant="contained" sx={{ mb: 2 }}>
                New Market
            </Button>
            <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={headCellStyle}>#</TableCell>
                            <TableCell sx={headCellStyle}>Name</TableCell>
                            <TableCell sx={headCellStyle}>Owner</TableCell>
                            <TableCell sx={headCellStyle}>Phone Number</TableCell>
                            <TableCell sx={headCellStyle}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} align="center"><CircularProgress /></TableCell></TableRow>
                        ) : data.items.length > 0 ? (
                            data.items.map((market, index) => (
                                <TableRow key={market.id}>
                                    <TableCell sx={headCellStyle}>{(data.pagination.page - 1) * data.pagination.per_page + index + 1}</TableCell>
                                    <TableCell sx={headCellStyle}>{market.name}</TableCell>
                                    <TableCell sx={headCellStyle}>{market.owner?.email || '-'}</TableCell>
                                    <TableCell sx={headCellStyle}>{market.phone_number || '-'}</TableCell>
                                    <TableCell sx={{ ...headCellStyle, display: 'flex', gap: 1 }}>
                                        <Button component={Link} to={`/admin/markets/${market.uuid}`} size="small" variant="outlined">
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No markets found.</TableCell>
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