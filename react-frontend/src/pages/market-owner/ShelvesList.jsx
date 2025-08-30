import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, CircularProgress, Box, Alert, IconButton, TextField, TablePagination
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ShelvesList() {
    const { marketUuid } = useContext(AuthContext);
    const [data, setData] = useState({ items: [], pagination: { total: 0, page: 1, per_page: 10 } });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newShelfCode, setNewShelfCode] = useState('');

    const fetchShelves = (page = 1, limit = 10) => {
        if (marketUuid) {
            setLoading(true);
            axiosInstance.get(`/shelves/?page=${page}&per_page=${limit}`)
                .then(res => {
                    setData(res.data || { items: [], pagination: { total: 0, page: 1, per_page: 10 } });
                })
                .catch(err => {
                    console.error("Failed to fetch shelves:", err);
                    setError('تعذر تحميل الرفوف.');
                })
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        fetchShelves(data.pagination.page, data.pagination.per_page);
    }, [marketUuid, data.pagination.page, data.pagination.per_page]);

    const handleAddShelf = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/shelves/', { code: newShelfCode, market_id: marketUuid });
            setNewShelfCode('');
            fetchShelves(1, data.pagination.per_page); // Refetch from page 1
        } catch (err) {
            setError('فشل إضافة الرف.');
        }
    };

    const handleDelete = (shelfId) => {
        axiosInstance.delete(`/shelves/${shelfId}`)
            .then(() => fetchShelves(data.pagination.page, data.pagination.per_page))
            .catch(err => setError('فشل حذف الرف.'));
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
            <Typography variant="h5" gutterBottom>الرفوف</Typography>
            <Box component="form" onSubmit={handleAddShelf} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField label="رمز رف جديد" value={newShelfCode} onChange={e => setNewShelfCode(e.target.value)} variant="outlined" size="small" />
                <Button type="submit" variant="contained">إضافة رف</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={headCellStyle}>#</TableCell>
                            <TableCell sx={headCellStyle}>الرمز</TableCell>
                            <TableCell sx={headCellStyle} align="right">الإجراءات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={3} align="center"><CircularProgress /></TableCell></TableRow>
                        ) : data.items.map((shelf, index) => (
                            <TableRow key={shelf.id}>
                                <TableCell sx={headCellStyle}>{(data.pagination.page - 1) * data.pagination.per_page + index + 1}</TableCell>
                                <TableCell sx={headCellStyle}>{shelf.code}</TableCell>
                                <TableCell sx={{ ...headCellStyle, display: 'flex', gap: 1 }} align="right">
                                    <IconButton onClick={() => handleDelete(shelf.uuid)} color="error"><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
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