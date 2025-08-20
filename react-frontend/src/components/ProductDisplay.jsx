// src/components/ProductDisplay.jsx

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack'; // استخدام Stack لتسهيل التنسيق

const ProductDisplay = ({ product, onClose }) => {
    if (!product) {
        return null;
    }

    return (
        <Box sx={{ p: 2 }}>
            {/* مقبض مرئي للإشارة إلى أن اللوح قابل للسحب */}
            <Box
                sx={{
                    width: 40,
                    height: 5,
                    backgroundColor: 'grey.300',
                    borderRadius: 3,
                    mx: 'auto',
                    mb: 2,
                }}
            />

            {/* زر الإغلاق */}
            <IconButton onClick={onClose} sx={{ position: 'absolute', top: 12, right: 12 }}>
                <CloseIcon />
            </IconButton>

            {/* استخدام Stack لتنظيم المحتوى */}
            <Stack spacing={2} sx={{ textAlign: 'center' }}>
                {/* اسم المنتج */}
                <Typography variant="h4" component="h2">
                    {product.name}
                </Typography>

                {/* الصورة (إذا كانت موجودة) */}
                {product.imageUrl && (
                    <Box
                        component="img"
                        src={product.imageUrl}
                        alt={product.name}
                        sx={{
                            width: '100%',
                            height: 200, // ارتفاع ثابت
                            objectFit: 'contain',
                            borderRadius: 1.5,
                            my: 2,
                        }}
                    />
                )}

                <Divider />

                {/* السعر */}
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
            </Stack>
        </Box>
    );
};

export default ProductDisplay;