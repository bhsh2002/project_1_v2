import { Box, Typography, IconButton, Grid, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const formatPrice = (price, currency) => {
    // إن كانت لديك عملة من الـ API مرّرها هنا، وإلا نعرض الرقم كما هو بتنسيق محلي
    if (price == null) return '';
    try {
        return currency
            ? new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(price)
            : Number(price).toLocaleString();
    } catch {
        return String(price);
    }
};

const ProductDisplay = ({ product, onClose }) => {
    const { imageUrl, name, price, currency } = product || {};

    return (
        <Box sx={{ p: { xs: 2, sm: 3 }, color: 'white' }}>
            {/* المقبض وزر الإغلاق */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', mb: 2 }}>
                <Box sx={{ width: 40, height: 5, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: '2.5px' }} />
                <IconButton onClick={onClose} sx={{ position: 'absolute', top: -8, right: 0, color: 'white' }} aria-label="إغلاق اللوح">
                    <CloseIcon />
                </IconButton>
            </Box>

            <Grid container spacing={3} alignItems="center">
                {/* الصورة (إذا وجدت) */}
                {!!imageUrl && (
                    <Grid item xs={12} sm={4}>
                        <Box
                            component="img"
                            src={imageUrl}
                            alt={name || 'صورة المنتج'}
                            sx={{ width: '100%', height: 'auto', maxHeight: 150, objectFit: 'contain', borderRadius: 2 }}
                            loading="lazy"
                        />
                    </Grid>
                )}

                {/* التفاصيل */}
                <Grid item xs={12} sm={imageUrl ? 8 : 12}>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                        {name || 'منتج بدون اسم'}
                    </Typography>
                    <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
                    <Typography variant="h4" component="p" sx={{ fontWeight: 'bold', color: '#66bb6a' }}>
                        {formatPrice(price, currency)}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProductDisplay;
