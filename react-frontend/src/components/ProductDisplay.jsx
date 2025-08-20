import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// لإضافة تأثير ظهور بسيط
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const ProductDisplay = ({ product }) => {
    if (!product) {
        return null;
    }

    return (
        <Card
            sx={{
                width: '100%',
                maxWidth: 345,
                textAlign: 'center',
                animation: `${fadeIn} 0.5s ease-out`
            }}
        >
            {/* عرض الصورة فقط إذا كانت موجودة */}
            {product.imageUrl && (
                <CardMedia
                    component="img"
                    height="194"
                    image={product.imageUrl}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                />
            )}
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    السعر: {product.price}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ProductDisplay;