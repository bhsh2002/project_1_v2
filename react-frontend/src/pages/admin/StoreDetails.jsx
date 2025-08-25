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
    const { storeUuid } = useParams();
    const [store, setStore] = useState(null);
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);

    useEffect(() => {
        axiosInstance.get(`/stores/${storeUuid}/`)
            .then((res) => {
                setStore(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [storeUuid]);

    useEffect(() => {
        if (tab === 1 && storeUuid) {
            setUsersLoading(true);
            axiosInstance.get(`/markets/${storeUuid}/users`)
                .then(res => {
                    setUsers(res.data.items || []);
                })
                .catch(err => console.error("Failed to fetch users", err))
                .finally(() => setUsersLoading(false));
        }
    }, [tab, storeUuid]);

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
                    <Typography variant="body1">📞 الهاتف: {store.phone_number}</Typography>
                    <Typography variant="body1">👤 المالك: {store.owner?.username}</Typography>
                </Box>
            )}

            {tab === 1 && (
                <Box>
                    <Typography variant="subtitle1" gutterBottom>المستخدمون المرتبطون:</Typography>
                    {usersLoading ? <CircularProgress /> : (
                        <List>
                            {users.length > 0 ? (
                                users.map((u) => (
                                    <div key={u.storeUuid}>
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
                    )}
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
