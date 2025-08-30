import React from 'react';
import { Box, Container, Typography, Grid, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const storeBenefits = [
    { bold: 'توفير في التكاليف:', text: 'استغن عن أجهزة قارئات الأسعار الباهظة.' },
    { bold: 'سهولة الإدارة:', text: 'تحديث الأسعار والمنتجات ببساطة عبر منصة سحابية.' },
    { bold: 'تقليل الازدحام:', text: 'قدم تجربة تسوق سلسة لعملائك دون انتظار.' }
];

const shopperBenefits = [
    { bold: 'سرعة وفورية:', text: 'احصل على السعر فور مسح الباركود بهاتفك.' },
    { bold: 'راحة تامة:', text: 'لا حاجة للبحث عن قارئ أسعار أو انتظار دوره.' },
    { bold: 'تحديثات حقيقية:', text: 'تأكد أن الأسعار التي تراها هي الأسعار الصحيحة.' }
];

function BenefitCard({ title, benefits }) {
    return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" component="h4" color="primary.main" sx={{ mb: 2 }}>{title}</Typography>
            <List>
                {benefits.map((item, index) => (
                    <ListItem key={index} disableGutters>
                        <ListItemIcon sx={{ minWidth: 'auto', mr: 1.5 }}>
                            <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography component="span">
                                    <Typography component="span" fontWeight="bold">{item.bold}</Typography> {item.text}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}

function Benefits() {
    return (
        <Box component="section" id="benefits" sx={{ py: 10, bgcolor: 'grey.100' }}>
            <Container>
                <Typography variant="h3" component="h3" textAlign="center" sx={{ mb: 8 }}>
                    المزايا الرئيسية
                </Typography>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <BenefitCard title="للمتاجر" benefits={storeBenefits} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <BenefitCard title="للمتسوقين" benefits={shopperBenefits} />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default Benefits;