import { useState } from 'react';
import {
    TextField, Button, Paper, Typography, Grid, MenuItem, CircularProgress, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';

export default function StoreCreate() {
    const navigate = useNavigate();

    const [storeData, setStoreData] = useState({
        name: '',
        phone_number: '',
        createOwner: false,
        ownerUsername: '',
        ownerPassword: '',
    });

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setStoreData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        const payload = {
            name: storeData.name,
            phone_number: storeData.phone_number || undefined,
            createOwner: storeData.createOwner,
            owner: storeData.createOwner
                ? {
                    username: storeData.ownerUsername,
                    password: storeData.ownerPassword,
                }
                : undefined,
        };

        try {
            await axiosInstance.post('/markets/', payload);
            navigate('/admin/stores');
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Error creating store');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>Create New Store</Typography>
            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Store Name"
                            name="name"
                            value={storeData.name}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Phone Number"
                            name="phone_number"
                            value={storeData.phone_number}
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
                            value={storeData.createOwner}
                            onChange={handleChange}
                            fullWidth
                        >
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                        </TextField>
                    </Grid>

                    {storeData.createOwner && (
                        <>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Owner Username"
                                    name="ownerUsername"
                                    value={storeData.ownerUsername}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Owner Password"
                                    name="ownerPassword"
                                    value={storeData.ownerPassword}
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
                            {loading ? <CircularProgress size={24} /> : 'Create Store'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
}
