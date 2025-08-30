import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, CircularProgress, Box, Alert, IconButton, TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ShelvesList() {
    const { marketUuid } = useContext(AuthContext);
    const [shelves, setShelves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newShelfCode, setNewShelfCode] = useState('');

    const fetchShelves = () => {
        if (marketUuid) {
            axiosInstance.get(`/shelves/`)
                .then(res => {
                    setShelves(res.data.items || []);
                })
                .catch(err => {
                    console.error("Failed to fetch shelves:", err);
                    setError('Could not load shelves.');
                })
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        fetchShelves();
    }, [marketUuid]);

    const handleAddShelf = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/shelves/', { code: newShelfCode, market_id: null }); // market_id will be set by backend
            setNewShelfCode('');
            fetchShelves();
        } catch (err) {
            setError('Failed to add shelf.');
        }
    };

    const handleDelete = (shelfId) => {
        axiosInstance.delete(`/shelves/${shelfId}`)
            .then(() => fetchShelves())
            .catch(err => setError('Failed to delete shelf.'));
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Shelves</Typography>
            <Box component="form" onSubmit={handleAddShelf} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    label="New Shelf Code"
                    value={newShelfCode}
                    onChange={e => setNewShelfCode(e.target.value)}
                    variant="outlined"
                    size="small"
                />
                <Button type="submit" variant="contained">Add Shelf</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Code</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {shelves.map((shelf) => (
                            <TableRow key={shelf.id}>
                                <TableCell>{shelf.code}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleDelete(shelf.uuid)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}