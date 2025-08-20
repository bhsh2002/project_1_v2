import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';

const ProductDisplay = ({ product, onClose }) => {
    if (!product) {
        return null;
    }

    return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
            {/* زر الإغلاق */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', top: 8, right: 8 }}>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* اسم المنتج */}
            <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 'medium' }}>
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
                        height: 'auto',
                        maxHeight: '200px',
                        objectFit: 'contain', // contain أفضل من cover هنا
                        borderRadius: 2,
                        mb: 3,
                    }}
                />
            )}

            <Divider sx={{ my: 2 }} />

            {/* السعر (بحجم كبير ولون مميز) */}
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                    السعر
                </Typography>
                <Typography
                    variant="h3"
                    component="p"
                    sx={{
                        fontWeight: 'bold',
                        color: 'primary.main', // استخدام اللون الرئيسي للثيم
                        lineHeight: 1.2
                    }}
                >
                    {product.price}
                </Typography>
            </Box>
        </Box>
    );
};

export default ProductDisplay;