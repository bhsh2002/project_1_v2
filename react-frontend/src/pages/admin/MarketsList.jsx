import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, CircularProgress,
    Box
} from '@mui/material';
import { Link } from 'react-router-dom';

export default function MarketsList() {
    const [markets, setMarkets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMarkets = async () => {
        try {
            const response = await axiosInstance.get('/markets/');
            setMarkets(response.data.items || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarkets();
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Markets</Typography>
            <Button component={Link} to="/admin/markets/new" variant="contained" sx={{ mb: 2 }}>
                New Market
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Owner</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {markets.map((market) => (
                            <TableRow key={market.id}>
                                <TableCell>{market.id}</TableCell>
                                <TableCell>{market.name}</TableCell>
                                <TableCell>{market.owner?.email || '-'}</TableCell>
                                <TableCell>{market.phone_number || '-'}</TableCell>
                                <TableCell>
                                    <Button component={Link} to={`/admin/markets/${market.uuid}`} size="small">
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
