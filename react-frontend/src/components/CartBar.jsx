import { useCart } from '../context/CartContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const CartBar = ({ onOpenCart }) => {
    const { cartCount, totalPrice } = useCart();

    return (
        <Paper
            sx={{
                width: "90vw",
                p: 1,
                mx: 'auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'background.paper',
                boxShadow: "none"
            }}
        >
            {cartCount > 0 ? <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="h6">
                    المنتجات: <strong>{cartCount}</strong>
                </Typography>
                <Typography variant="h6">
                    الإجمالي: <strong>{totalPrice} د.ل</strong>
                </Typography>
            </Box> : <Typography variant="h6" color='error'>السلة فارغة</Typography>}
            <Button
                startIcon={<ShoppingCartIcon />}
                onClick={onOpenCart}
                sx={{ fontSize: '1.1rem' }}
            >
                عرض السلة
            </Button>
        </Paper>
    );
};

export default CartBar;