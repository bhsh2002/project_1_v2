import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const plans = [
    { name: 'Basic', sub: 'للمتاجر الصغيرة', features: ['5,000 منتج', 'فرع واحد', 'دعم فني عبر البريد الإلكتروني'], popular: false },
    { name: 'Pro', sub: 'للمتاجر المتوسطة', features: ['20,000 منتج', 'حتى 5 فروع', 'دعم فني عبر الدردشة', 'تكامل أساسي مع POS'], popular: true },
    { name: 'Enterprise', sub: 'للمتاجر الكبيرة والمولات', features: ['منتجات وفروع غير محدودة', 'تكامل مباشر مع POS', 'تقارير متقدمة', 'مدير حساب مخصص'], popular: false }
];

function PricingCard({ plan }) {
    const isPopular = plan.popular;
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 4,
                borderRadius: 3,
                borderColor: isPopular ? 'primary.main' : 'grey.300',
                bgcolor: isPopular ? 'primary.main' : 'grey.50',
                color: isPopular ? 'white' : 'text.primary',
                transform: isPopular ? 'scale(1.05)' : 'none',
                transition: 'transform 0.3s',
                zIndex: isPopular ? 1 : 0
            }}
        >
            <Typography variant="h5" component="h4">{plan.name}</Typography>
            <Typography sx={{ mb: 2, color: isPopular ? 'blue.200' : 'text.secondary' }}>{plan.sub}</Typography>
            <List>
                {plan.features.map(feature => (
                    <ListItem key={feature} disableGutters>
                        <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: isPopular ? 'white' : 'text.primary' }}>
                            <CheckIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                    </ListItem>
                ))}
            </List>
            <Button
                fullWidth
                href="#contact"
                variant="contained"
                sx={{
                    mt: 2,
                    bgcolor: isPopular ? 'white' : 'grey.200',
                    color: isPopular ? 'primary.main' : 'text.primary',
                    '&:hover': {
                        bgcolor: isPopular ? 'grey.200' : 'grey.300'
                    }
                }}
            >
                اطلب الآن
            </Button>
        </Paper>
    );
}

function Pricing() {
    return (
        <Box component="section" id="pricing" sx={{ py: 10, bgcolor: 'background.default' }}>
            <Container sx={{ textAlign: 'center' }}>
                <Typography variant="h3" component="h3" sx={{ mb: 2 }}>باقات الأسعار</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 8, maxWidth: '600px', mx: 'auto' }}>
                    حلولنا مصممة لتناسب جميع أحجام المتاجر.
                </Typography>
                <Grid container spacing={4} alignItems="center" justifyContent="center">
                    {plans.map(plan => (
                        <Grid item xs={12} md={4} key={plan.name}>
                            <PricingCard plan={plan} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

export default Pricing;