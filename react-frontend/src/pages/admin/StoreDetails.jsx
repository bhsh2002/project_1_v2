import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import {
    Paper, Typography, CircularProgress, Tabs, Tab,
    Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, Dialog, DialogTitle,
    DialogContent, TextField, DialogActions, MenuItem
} from '@mui/material';

function TabPanel({ children, value, index }) {
    return value === index && <Box sx={{ pt: 2 }}>{children}</Box>;
}

export default function StoreDetails() {
    const { storeId } = useParams();

    const [store, setStore] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabIndex, setTabIndex] = useState(0);

    // Dialog state
    const [inviteOpen, setInviteOpen] = useState(false);
    const [inviteData, setInviteData] = useState({ email: '', role: 'STORE_STAFF' });
    const [inviteLoading, setInviteLoading] = useState(false);

    const fetchStoreDetails = async () => {
        try {
            const response = await axiosInstance.get(`/admin/stores/${storeId}`);
            setStore(response.data.store);
            setMembers(response.data.members || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStoreDetails();
    }, [storeId]);

    const handleInviteOpen = () => setInviteOpen(true);
    const handleInviteClose = () => setInviteOpen(false);

    const handleInviteChange = (e) => {
        const { name, value } = e.target;
        setInviteData((prev) => ({ ...prev, [name]: value }));
    };

    const handleInviteSubmit = async () => {
        setInviteLoading(true);
        try {
            await axiosInstance.post(`/markets/${storeId}/members/invite`, inviteData);
            fetchStoreDetails(); // Refresh members
            handleInviteClose();
        } catch (err) {
            console.error(err);
        } finally {
            setInviteLoading(false);
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>{store.name}</Typography>
            <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)}>
                <Tab label="General Info" />
                <Tab label="Members" />
            </Tabs>

            {/* General Info Tab */}
            <TabPanel value={tabIndex} index={0}>
                <Typography><strong>ID:</strong> {store.id}</Typography>
                <Typography><strong>Slug:</strong> {store.slug}</Typography>
                <Typography><strong>Country:</strong> {store.country}</Typography>
                <Typography><strong>Currency:</strong> {store.currency}</Typography>
                <Typography><strong>Status:</strong> {store.status}</Typography>
            </TabPanel>

            {/* Members Tab */}
            <TabPanel value={tabIndex} index={1}>
                <Button variant="contained" onClick={handleInviteOpen} sx={{ mb: 2 }}>
                    Invite Member
                </Button>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {members.map((m) => (
                                <TableRow key={m.id}>
                                    <TableCell>{m.id}</TableCell>
                                    <TableCell>{m.user?.name}</TableCell>
                                    <TableCell>{m.user?.email}</TableCell>
                                    <TableCell>{m.role}</TableCell>
                                    <TableCell>{m.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Invite Dialog */}
                <Dialog open={inviteOpen} onClose={handleInviteClose}>
                    <DialogTitle>Invite Member</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Email"
                            name="email"
                            value={inviteData.email}
                            onChange={handleInviteChange}
                            fullWidth
                            sx={{ mt: 1 }}
                        />
                        <TextField
                            select
                            label="Role"
                            name="role"
                            value={inviteData.role}
                            onChange={handleInviteChange}
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            <MenuItem value="STORE_OWNER">Owner</MenuItem>
                            <MenuItem value="STORE_MANAGER">Manager</MenuItem>
                            <MenuItem value="STORE_STAFF">Staff</MenuItem>
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleInviteClose}>Cancel</Button>
                        <Button onClick={handleInviteSubmit} disabled={inviteLoading}>
                            {inviteLoading ? 'Inviting...' : 'Invite'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </TabPanel>
        </Paper>
    );
}
