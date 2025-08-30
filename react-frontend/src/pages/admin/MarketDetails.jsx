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

export default function MarketDetails() {
    const { marketUuid } = useParams();
    const [market, setMarket] = useState(null);
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);

    useEffect(() => {
        axiosInstance.get(`/markets/${marketUuid}`)
            .then((res) => {
                setMarket(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setErrorMsg("Failed to load market details.");
                setLoading(false);
            });
    }, [marketUuid]);

    useEffect(() => {
        if (tab === 1 && marketUuid) {
            setUsersLoading(true);
            axiosInstance.get(`/markets/${marketUuid}/users`)
                .then(res => {
                    setUsers(res.data.items || []);
                })
                .catch(err => console.error("Failed to fetch users", err))
                .finally(() => setUsersLoading(false));
        }
    }, [tab, marketUuid]);

    if (loading) return <CircularProgress />;
    if (errorMsg) return <Alert severity="error">{errorMsg}</Alert>;
    if (!market) return <Typography>المتجر غير موجود</Typography>;

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                تفاصيل المتجر: {market.name}
            </Typography>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab label="معلومات أساسية" />
                <Tab label="المستخدمون" />
                <Tab label="السجل" />
            </Tabs>

            {tab === 0 && (
                <Box>
                    <Typography variant="body1">📌 الاسم: {market.name}</Typography>
                    <Typography variant="body1">📞 الهاتف: {market.phone_number}</Typography>
                    <Typography variant="body1">👤 المالك: {market.owner?.username}</Typography>
                </Box>
            )}

            {tab === 1 && (
                <Box>
                    <Typography variant="subtitle1" gutterBottom>المستخدمون المرتبطون:</Typography>
                    {usersLoading ? <CircularProgress /> : (
                        <List>
                            {users.length > 0 ? (
                                users.map((u) => (
                                    <div key={u.id}>
                                        <ListItem>
                                            <ListItemText primary={u.username} />
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
                        {market.logs && market.logs.length > 0 ? (
                            market.logs.map((log, i) => (
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
