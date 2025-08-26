import { useState } from 'react';
import {
    TextField, Button, Paper, Typography, Grid, MenuItem, CircularProgress, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';

export default function MarketCreate() {
    const navigate = useNavigate();

    const [marketData, setMarketData] = useState({
        name: '',
        phoneNumber: '',
        ownerUsername: '',
        ownerPassword: '',
    });

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setMarketData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        const payload = {
            name: marketData.name,
            phone_number: marketData.phoneNumber || undefined,
            owner_username: marketData.ownerUsername || undefined,
            owner_password: marketData.ownerPassword || undefined,
        };

        try {
            await axiosInstance.post('/markets/', payload);
            navigate('/admin/markets');
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Error creating market');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>Create New Market</Typography>
            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Market Name"
                            name="name"
                            value={marketData.name}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Phone Number"
                            name="phoneNumber"
                            value={marketData.phoneNumber}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Create Owner?"
                            name="createOwner"
                            value={marketData.createOwner}
                            onChange={handleChange}
                            fullWidth
                        >
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                        </TextField>
                    </Grid>

                    {marketData.createOwner && (
                        <>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Owner Username"
                                    name="ownerUsername"
                                    value={marketData.ownerUsername}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Owner Password"
                                    name="ownerPassword"
                                    value={marketData.ownerPassword}
                                    onChange={handleChange}
                                    required
                                    type="password"
                                    fullWidth
                                />
                            </Grid>
                        </>
                    )}

                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Create Market'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
}
