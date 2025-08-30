import { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Paper,
    Typography,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Divider,
    Alert
} from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from '@mui/icons-material/Inventory';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import axiosInstance from '../../api/axios';

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axiosInstance
            .get("/admin/dashboard")
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.error("Error fetching dashboard stats:", err);
                setError('Failed to load dashboard data.');
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!data) return <Typography>No data available.</Typography>;

    const { stats, recent_markets } = data;

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                لوحة التحكم الرئيسية
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}><StatCard icon={<StorefrontIcon fontSize="large" color="primary" />} title="Total Markets" value={stats.total_markets} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard icon={<PeopleIcon fontSize="large" color="secondary" />} title="Total Users" value={stats.total_users} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard icon={<InventoryIcon fontSize="large" color="success" />} title="Total Products" value={stats.total_products} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard icon={<ViewQuiltIcon fontSize="large" color="warning" />} title="Total Shelves" value={stats.total_shelves} /></Grid>
            </Grid>

            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    آخر المتاجر المضافة
                </Typography>
                <List>
                    {recent_markets && recent_markets.length > 0 ? (
                        recent_markets.map((market, i) => (
                            <div key={i}>
                                <ListItem>
                                    <ListItemText
                                        primary={market.name}
                                        secondary={`Created on: ${new Date(market.created_at).toLocaleDateString()}`}
                                    />
                                </ListItem>
                                {i < recent_markets.length - 1 && <Divider />}
                            </div>
                        ))
                    ) : (
                        <Typography>لا توجد متاجر مضافة حديثًا</Typography>
                    )}
                </List>
            </Paper>
        </Box>
    );
}

function StatCard({ icon, title, value }) {
    return (
        <Paper sx={{ p: 2, textAlign: "center", height: '100%' }}>
            {icon}
            <Typography variant="h6">{title}</Typography>
            <Typography variant="h4">{value}</Typography>
        </Paper>
    );
}
