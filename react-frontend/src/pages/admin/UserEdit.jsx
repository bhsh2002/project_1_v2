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
            setErrorMsg('فشل تحميل المستخدم');
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
            setErrorMsg('فشل تحديث المستخدم');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>تعديل المستخدم</Typography>
            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            label="الاسم"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            label="البريد الإلكتروني"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            type="email"
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            select
                            label="الأدوار"
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
                    <Grid item size={{ xs: 12 }}>
                        <TextField
                            select
                            label="الحالة"
                            name="is_active"
                            value={userData.is_active ? 'true' : 'false'}
                            onChange={(e) => setUserData((prev) => ({ ...prev, is_active: e.target.value === 'true' }))}
                            fullWidth
                        >
                            <MenuItem value="true">نشط</MenuItem>
                            <MenuItem value="false">غير نشط</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item size={{ xs: 12 }}>
                        <Button type="submit" variant="contained" disabled={saving}>
                            {saving ? <CircularProgress size={24} /> : 'تحديث المستخدم'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
}