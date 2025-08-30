// UsersList.jsx

import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, CircularProgress, IconButton, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
    Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null });

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/users/');
            setUsers(response.data.items || []);
        } catch (error) {
            setErrorMsg('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async () => {
        try {
            await axiosInstance.delete(`/users/${deleteDialog.userId}`);
            setDeleteDialog({ open: false, userId: null });
            fetchUsers();
        } catch (error) {
            setErrorMsg('Failed to delete user');
        }
    };

    if (loading) return <CircularProgress />;

    // تم إضافة هذه الخاصية لتطبيقها على خلايا الرأس
    const headCellStyle = {
        whiteSpace: 'nowrap', // منع التفاف النص
        fontWeight: 'bold', // جعل الخط عريضًا للتميز
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Users</Typography>
            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
            <Button component={Link} to="/admin/users/new" variant="contained" sx={{ mb: 2 }}>
                New User
            </Button>
            <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={headCellStyle}>ID</TableCell>
                            <TableCell sx={headCellStyle}>Username</TableCell>
                            <TableCell sx={headCellStyle}>Roles</TableCell>
                            <TableCell sx={headCellStyle}>Status</TableCell>
                            <TableCell sx={headCellStyle}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.roles?.join(', ')}</TableCell>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                backgroundColor: user.is_active ? 'success.light' : 'error.light',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                textAlign: 'center',
                                                display: 'inline-block',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton component={Link} to={`/admin/users/${user.id}/edit`} color="primary">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => setDeleteDialog({ open: true, userId: user.id })} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography>No users found.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete Confirmation Dialog */}
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