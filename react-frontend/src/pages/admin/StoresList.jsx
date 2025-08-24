import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';

export default function StoresList() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStores = async () => {
        try {
            const response = await axiosInstance.get('/markets');
            setStores(response.data.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <div>
            <Typography variant="h5" gutterBottom>Stores</Typography>
            <Button component={Link} to="/admin/stores/new" variant="contained" sx={{ mb: 2 }}>
                New Store
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Owner</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stores.map((store) => (
                            <TableRow key={store.id}>
                                <TableCell>{store.id}</TableCell>
                                <TableCell>{store.name}</TableCell>
                                <TableCell>{store.owner?.email || '-'}</TableCell>
                                <TableCell>{store.status}</TableCell>
                                <TableCell>
                                    <Button component={Link} to={`/admin/stores/${store.id}`} size="small">
                                        View
                                    </Button>
                                    {/* يمكن إضافة Edit/Delete لاحقًا */}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
