import { useCart } from '../context/CartContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import Slide from '@mui/material/Slide';
import { forwardRef, useState } from 'react';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import DialogContentText from '@mui/material/DialogContentText';

// Transition for a smoother dialog opening on mobile
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const CartDialog = ({ open, onClose }) => {
    const { cartItems, addToCart, removeFromCart, deleteFromCart, clearCart, totalPrice } = useCart();

    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleConfirmClear = () => {
        clearCart();
        setConfirmOpen(false);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm" // Good for tablets and desktops
                fullScreen // Use fullScreen for small screens
                sx={{ zIndex: 2100 }} // أعلى من CartBar
                TransitionComponent={Transition}
                PaperProps={{
                    sx: {
                        // On larger screens, don't be full screen
                        '@media (min-width: 600px)': {
                            width: '400px',
                            height: 'auto',
                            maxHeight: '80vh',
                            borderRadius: '12px',
                        },
                        display: 'flex',
                        flexDirection: 'column',
                    },
                }}
            >
                {/* --- Dialog Header --- */}
                <DialogTitle sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" component="div">
                            سلة المشتريات
                        </Typography>
                        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                {/* --- Dialog Content (Items List) --- */}
                <DialogContent dividers sx={{ p: { xs: 1, sm: 2 } }}>
                    {cartItems.length === 0 ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="body1" color="text.secondary">
                                سلتك فارغة حاليًا.
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {cartItems.map(item => (
                                <Card key={item.id} sx={{ display: 'flex', alignItems: 'center' }} elevation={1}>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 80, height: 80, objectFit: 'contain', p: 0.5 }}
                                        image={"https://price.savana.ly/back/api/v1/products" + item.image_url}
                                        alt={item.name}
                                    />
                                    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 1 }}>
                                        <Typography component="div" sx={{ fontWeight: 'bold' }}>
                                            {item.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" component="div">
                                            {`الإجمالي: ${(item.price * item.quantity).toFixed(2)} د.ل`}
                                        </Typography>
                                        {/* --- Quantity Controls --- */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <IconButton size="small" onClick={() => removeFromCart(item.id)}><RemoveIcon fontSize="inherit" /></IconButton>
                                            <Typography sx={{ px: 1.5 }} variant="body2">{item.quantity}</Typography>
                                            <IconButton size="small" onClick={() => addToCart(item)}><AddIcon fontSize="inherit" /></IconButton>
                                        </Box>
                                    </Box>
                                    <Tooltip title="حذف المنتج">
                                        <IconButton onClick={() => deleteFromCart(item.id)} size="small" sx={{ alignSelf: 'flex-start', m: 0.5 }}>
                                            <DeleteForeverIcon color="error" />
                                        </IconButton>
                                    </Tooltip>
                                </Card>
                            ))}
                        </Box>
                    )}
                </DialogContent>

                {/* --- Dialog Footer (Total and Actions) --- */}
                {cartItems.length > 0 && (
                    <Box sx={{ p: 2, backgroundColor: 'background.default', borderTop: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="body1">الإجمالي النهائي</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{totalPrice} د.ل</Typography>
                        </Box>
                        <DialogActions sx={{ p: 0, justifyContent: 'space-between', gap: 1 }}>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => setConfirmOpen(true)} // فتح نافذة التأكيد
                            >
                                تفريغ السلة
                            </Button>
                            <Button variant="contained" onClick={onClose} sx={{ flexGrow: 1 }}>
                                متابعة
                            </Button>
                        </DialogActions>
                    </Box>
                )}
            </Dialog>

            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
                sx={{ zIndex: 2200 }} // أعلى من CartDialog
            >
                <DialogTitle id="confirm-dialog-title">
                    تأكيد تفريغ السلة
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        هل أنت متأكد من رغبتك في حذف جميع المنتجات؟ لا يمكن التراجع عن هذا الإجراء.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>إلغاء</Button>
                    <Button onClick={handleConfirmClear} color="error" autoFocus>
                        تأكيد الحذف
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CartDialog;