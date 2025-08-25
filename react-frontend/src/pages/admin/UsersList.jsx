import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, CircularProgress, IconButton, Alert, Dialog, DialogTitle, DialogContent, DialogActions
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
            await axiosInstance.delete(`/users/${deleteDialog.userId}/`);
            setDeleteDialog({ open: false, userId: null });
            fetchUsers();
        } catch (error) {
            setErrorMsg('Failed to delete user');
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <div>
            <Typography variant="h5" gutterBottom>Users</Typography>
            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
            <Button component={Link} to="/admin/users/new" variant="contained" sx={{ mb: 2 }}>
                New User
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Roles</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.roles?.join(', ')}</TableCell>
                                <TableCell>{user.is_active ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>
                                    <IconButton
                                        component={Link}
                                        to={`/admin/users/${user.id}/edit`}
                                        color="primary"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => setDeleteDialog({ open: true, userId: user.id })}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
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
        </div>
    );
}
