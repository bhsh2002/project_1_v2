import { useState } from 'react';
import {
    TextField, Button, Paper, Typography, Grid, MenuItem, CircularProgress, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';

export default function UserCreate() {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        roles: [],
    });

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const roleOptions = ['SUPER_ADMIN', 'MARKET_OWNER', 'MARKET_MANAGER', 'MARKET_STAFF'];

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
        setLoading(true);

        try {
            await axiosInstance.post('/users/', userData);
            navigate('/admin/users');
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'خطأ في إنشاء المستخدم');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>إنشاء مستخدم جديد</Typography>
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
                            required
                            type="email"
                            fullWidth
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            label="كلمة المرور"
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            required
                            type="password"
                            fullWidth
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
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
                    <Grid size={{ xs: 12 }}>
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'إنشاء مستخدم'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
}