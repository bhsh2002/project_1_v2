import { Box, Typography, IconButton, Grid, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ProductDisplay = ({ product, onClose }) => {
    return (
        <Box sx={{ p: { xs: 2, sm: 3 }, color: 'white' }}>
            {/* المقبض وزر الإغلاق */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', mb: 2 }}>
                <Box sx={{ width: 40, height: 5, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: '2.5px' }} />
                <IconButton onClick={onClose} sx={{ position: 'absolute', top: -8, right: 0, color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Grid container spacing={3} alignItems="center">
                {/* الصورة (إذا وجدت) */}
                {product.imageUrl && (
                    <Grid item xs={12} sm={4}>
                        <Box
                            component="img"
                            src={product.imageUrl}
                            alt={product.name}
                            sx={{ width: '100%', height: 'auto', maxHeight: 150, objectFit: 'contain', borderRadius: 2 }}
                        />
                    </Grid>
                )}

                {/* التفاصيل */}
                <Grid item xs={12} sm={product.imageUrl ? 8 : 12}>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                        {product.name}
                    </Typography>
                    <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
                    <Typography variant="h4" component="p" sx={{ fontWeight: 'bold', color: '#66bb6a' /* أخضر فاتح */ }}>
                        {product.price}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProductDisplay;