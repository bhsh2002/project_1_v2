import { useState, useEffect } from 'react';
import {
    TextField, Button, Paper, Typography, Grid, MenuItem, CircularProgress, Alert
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axios';

export default function UserEdit() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        roles: [],
        is_active: true,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const roleOptions = ['SUPER_ADMIN', 'MARKET_OWNER', 'MARKET_MANAGER', 'MARKET_STAFF'];

    const fetchUser = async () => {
        try {
            const response = await axiosInstance.get(`/users/${userId}`);
            setUserData(response.data);
        } catch (error) {
            setErrorMsg('Failed to load user');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRolesChange = (e) => {
        const { value } = e.target;
        setUserData((prev) => ({ ...prev, roles: typeof value === 'string' ? value.split(',') : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSaving(true);

        try {
            await axiosInstance.put(`/admin/users/${userId}`, userData);
            navigate('/admin/users');
        } catch (error) {
            setErrorMsg('Failed to update user');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>Edit User</Typography>
            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Name"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            type="email"
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            select
                            label="Roles"
                            name="roles"
                            SelectProps={{ multiple: true }}
                            value={userData.roles}
                            onChange={handleRolesChange}
                            fullWidth
                        >
                            {roleOptions.map((role) => (
                                <MenuItem key={role} value={role}>{role}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Status"
                            name="is_active"
                            value={userData.is_active ? 'true' : 'false'}
                            onChange={(e) => setUserData((prev) => ({ ...prev, is_active: e.target.value === 'true' }))}
                            fullWidth
                        >
                            <MenuItem value="true">Active</MenuItem>
                            <MenuItem value="false">Inactive</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" disabled={saving}>
                            {saving ? <CircularProgress size={24} /> : 'Update User'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
}
