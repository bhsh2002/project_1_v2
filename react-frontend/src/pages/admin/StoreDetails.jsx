import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material';
import axiosInstance from '../../api/axios';

export default function StoreDetails() {
    const { id } = useParams();
    const [store, setStore] = useState(null);
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance.get(`/admin/stores/${id}`)
            .then((res) => {
                setStore(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <CircularProgress />;
    if (!store) return <Typography>المتجر غير موجود</Typography>;

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                تفاصيل المتجر: {store.name}
            </Typography>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab label="معلومات أساسية" />
                <Tab label="المستخدمون" />
                <Tab label="السجل" />
            </Tabs>

            {tab === 0 && (
                <Box>
                    <Typography variant="body1">📌 الاسم: {store.name}</Typography>
                    <Typography variant="body1">📍 الموقع: {store.location}</Typography>
                    <Typography variant="body1">👤 المالك: {store.owner?.name}</Typography>
                    <Typography variant="body1">📧 البريد: {store.owner?.email}</Typography>
                </Box>
            )}

            {tab === 1 && (
                <Box>
                    <Typography variant="subtitle1" gutterBottom>المستخدمون المرتبطون:</Typography>
                    <List>
                        {store.users && store.users.length > 0 ? (
                            store.users.map((u) => (
                                <div key={u.id}>
                                    <ListItem>
                                        <ListItemText primary={u.name} secondary={u.email} />
                                    </ListItem>
                                    <Divider />
                                </div>
                            ))
                        ) : (
                            <Typography>لا يوجد مستخدمون</Typography>
                        )}
                    </List>
                </Box>
            )}

            {tab === 2 && (
                <Box>
                    <Typography variant="subtitle1" gutterBottom>سجل النشاطات:</Typography>
                    <List>
                        {store.logs && store.logs.length > 0 ? (
                            store.logs.map((log, i) => (
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
                            <Typography>لا يوجد سجلات</Typography>
                        )}
                    </List>
                </Box>
            )}
        </Paper>
    );
}
