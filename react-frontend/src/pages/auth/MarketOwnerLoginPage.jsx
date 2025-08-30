import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Alert,
} from "@mui/material";

export default function MarketOwnerLoginPage() {
    const { loginMarketOwner } = useContext(AuthContext);
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await loginMarketOwner(username, password);
            navigate("/market-owner/dashboard");
        } catch (err) {
            setError("خطأ في اسم المستخدم أو كلمة المرور");
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper sx={{ p: 3, mt: 8 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    تسجيل دخول صاحب المتجر
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="اسم المستخدم"
                        type="text"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="كلمة المرور"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && (
                        <Typography color="error" variant="body2" align="center" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        دخول
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}