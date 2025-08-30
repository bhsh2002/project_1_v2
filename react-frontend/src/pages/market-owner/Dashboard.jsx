import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
    Box,
    Grid,
    Paper,
    Typography,
    CircularProgress,
    Alert
} from "@mui/material";
import InventoryIcon from '@mui/icons-material/Inventory';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import axiosInstance from '../../api/axios';

export default function Dashboard() {
    const { marketUuid } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (marketUuid) {
            axiosInstance.get(`/markets/${marketUuid}/dashboard`)
                .then((res) => {
                    setStats(res.data);
                })
                .catch((err) => {
                    console.error("Error fetching dashboard stats:", err);
                    setError('Failed to load dashboard statistics.');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [marketUuid]);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!stats) return <Typography>No statistics available.</Typography>;

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                لوحة التحكم
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 3, textAlign: "center" }}>
                        <InventoryIcon fontSize="large" color="primary" />
                        <Typography variant="h6">إجمالي المنتجات</Typography>
                        <Typography variant="h4">{stats.total_products}</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 3, textAlign: "center" }}>
                        <ViewQuiltIcon fontSize="large" color="secondary" />
                        <Typography variant="h6">إجمالي الرفوف</Typography>
                        <Typography variant="h4">{stats.total_shelves}</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}