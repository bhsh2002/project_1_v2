import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, CircularProgress, IconButton, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
    Box, TablePagination
} from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function UsersList() {
    const [data, setData] = useState({ items: [], pagination: { total: 0, page: 1, per_page: 10 } });
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null });

    const fetchUsers = async (page = 1, limit = 10) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/users/?page=${page}&per_page=${limit}`);
            setData(response.data || { items: [], pagination: { total: 0, page: 1, per_page: 10 } });
        } catch (error) {
            setErrorMsg('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(data.pagination.page, data.pagination.per_page);
    }, [data.pagination.page, data.pagination.per_page]);

    const handleDeleteUser = async () => {
        try {
            await axiosInstance.delete(`/users/${deleteDialog.userId}`);
            setDeleteDialog({ open: false, userId: null });
            fetchUsers(data.pagination.page, data.pagination.per_page); // Refetch current page
        } catch (error) {
            setErrorMsg('Failed to delete user');
        }
    };

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
            <Typography variant="h5" gutterBottom>Users</Typography>
            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
            <Button component={Link} to="/admin/users/new" variant="contained" sx={{ mb: 2 }}>
                New User
            </Button>
            <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={headCellStyle}>#</TableCell>
                            <TableCell sx={headCellStyle}>Username</TableCell>
                            <TableCell sx={headCellStyle}>Roles</TableCell>
                            <TableCell sx={headCellStyle}>Status</TableCell>
                            <TableCell sx={headCellStyle}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} align="center"><CircularProgress /></TableCell></TableRow>
                        ) : data.items.length > 0 ? (
                            data.items.map((user, index) => (
                                <TableRow key={user.id}>
                                    <TableCell sx={headCellStyle}>{(data.pagination.page - 1) * data.pagination.per_page + index + 1}</TableCell>
                                    <TableCell sx={headCellStyle}>{user.username}</TableCell>
                                    <TableCell sx={headCellStyle}>{user.roles?.join(', ')}</TableCell>
                                    <TableCell sx={headCellStyle}>
                                        <Box sx={{ backgroundColor: user.is_active ? 'success.light' : 'error.light', color: 'white', padding: '4px 8px', borderRadius: '12px', textAlign: 'center', display: 'inline-block', fontSize: '0.8rem' }}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ ...headCellStyle, display: 'flex', gap: 1 }}>
                                        <IconButton component={Link} to={`/admin/users/${user.id}/edit`} color="primary"><EditIcon /></IconButton>
                                        <IconButton onClick={() => setDeleteDialog({ open: true, userId: user.id })} color="error"><DeleteIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={5} align="center">No users found.</TableCell></TableRow>
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

            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, userId: null })}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>Are you sure you want to delete this user?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, userId: null })}>Cancel</Button>
                    <Button onClick={handleDeleteUser} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}