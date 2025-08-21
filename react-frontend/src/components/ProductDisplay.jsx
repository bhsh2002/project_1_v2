// src/components/ProductDisplay.jsx

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

const ProductDisplay = ({ product, onClose }) => {
    if (!product) {
        return null;
    }

    return (
        // زيادة الـ padding قليلًا لراحة العين داخل النافذة
        <Box sx={{ p: { xs: 2, sm: 3 }, position: 'relative' }}>

            {/* زر الإغلاق اليدوي (اختياري لكنه جيد لتجربة المستخدم) */}
            <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
                <CloseIcon />
            </IconButton>

            {Object.keys(product).length > 0 ? <Stack spacing={2} sx={{ textAlign: 'center' }}>
                <Typography variant="h4" component="h2" sx={{ mt: 2 }}>
                    {product.name}
                </Typography>

                {product.imageUrl && (
                    <Box
                        component="img"
                        src={product.imageUrl}
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
            </Stack> : <Typography variant="h4" component="h2" sx={{ mt: 2 }}>
                !لم يتم إيجاد المنتج
            </Typography>}
        </Box>
    );
};

export default ProductDisplay;