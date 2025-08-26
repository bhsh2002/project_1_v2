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
} from "@mui/material";
import MarketfrontIcon from "@mui/icons-material/Storefront";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import axiosInstance from '../../api/axios';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance
            .get("/admin/dashboard")
            .then((res) => {
                setStats(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching dashboard stats:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                لوحة التحكم
            </Typography>

            {/* ====== الإحصائيات ====== */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 3, textAlign: "center" }}>
                        <MarketfrontIcon fontSize="large" color="primary" />
                        <Typography variant="h6">عدد المتاجر</Typography>
                        <Typography variant="h4">{stats.totalMarkets}</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 3, textAlign: "center" }}>
                        <PeopleIcon fontSize="large" color="secondary" />
                        <Typography variant="h6">عدد المستخدمين</Typography>
                        <Typography variant="h4">{stats.totalUsers}</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 3, textAlign: "center" }}>
                        <AssignmentIcon fontSize="large" color="success" />
                        <Typography variant="h6">عدد العمليات</Typography>
                        <Typography variant="h4">{stats.totalLogs}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* ====== آخر النشاطات ====== */}
            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    آخر النشاطات
                </Typography>
                <List>
                    {stats.recentLogs && stats.recentLogs.length > 0 ? (
                        stats.recentLogs.map((log, i) => (
                            <div key={i}>
                                <ListItem>
                                    <ListItemText
                                        primary={log.action}
                                        secondary={new Date(log.timestamp).toLocaleString()}
                                    />
                                </ListItem>
                                <Divider />
                            </div>
                        ))
                    ) : (
                        <Typography>لا يوجد نشاطات حديثة</Typography>
                    )}
                </List>
            </Paper>
        </Box>
    );
}
