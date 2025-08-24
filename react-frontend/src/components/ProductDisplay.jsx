// src/components/ProductDisplay.jsx

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useCart } from '../context/CartContext';
import Button from '@mui/material/Button';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const ProductDisplay = ({ product, onClose }) => {
    const { addToCart } = useCart();

    if (!product) {
        return null;
    }

    const handleAddToCart = () => {
        addToCart(product);
        onClose();
    };

    return (
        // زيادة الـ padding قليلًا لراحة العين داخل النافذة
        <Box sx={{ p: { xs: 2, sm: 3 }, pt: { xs: 5, sm: 6 }, position: 'relative' }} minWidth="80vw" maxWidth={"90vw"}>

            {/* زر الإغلاق اليدوي (اختياري لكنه جيد لتجربة المستخدم) */}
            <IconButton onClick={onClose} sx={{ position: 'absolute', top: 2, right: 2 }}>
                <CloseIcon />
            </IconButton>

            <Divider />

            {Object.keys(product).length > 0 ? <Stack spacing={2} sx={{ textAlign: 'center' }}>
                <Typography variant="h4" component="h2" sx={{ mt: 2 }}>
                    {product.name}
                </Typography>

                {product.image_url && (
                    <Box
                        component="img"
                        src={"https://price.savana.ly/back/api/v1/products" + product.image_url}
                        alt={product.name}
                        sx={{
                            width: '100%',
                            height: 200,
                            objectFit: 'contain',
                            borderRadius: 1.5,
                            my: 2,
                        }}
                    />
                )}

                <Divider />

                <Box>
                    <Typography variant="body1" color="text.secondary">
                        السعر
                    </Typography>
                    <Typography
                        variant="h3"
                        component="p"
                        sx={{ fontWeight: 'bold', color: 'primary.main' }}
                    >
                        {product.price}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={handleAddToCart}
                    size="large"
                >
                    إضافة إلى السلة
                </Button>
            </Stack> : <Typography variant="h4" component="h2" sx={{ mt: 2 }}>
                !لم يتم إيجاد المنتج
            </Typography>}
        </Box>
    );
};

export default ProductDisplay;