import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const navItems = [
    { label: 'المزايا', id: '#benefits' },
    { label: 'كيف يعمل؟', id: '#how-it-works' },
    { label: 'الأسعار', id: '#pricing' },
];

function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2, color: 'primary.main', fontWeight: 'bold' }}>
                ساوملي
            </Typography>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton component="a" href={item.id} sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disablePadding>
                    <ListItemButton component="a" href="#contact" sx={{ justifyContent: 'center' }}>
                        <Button variant="contained" color="primary">تواصل معنا</Button>
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            <AppBar component="header" position="fixed" sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
                <Container>
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <Typography variant="h5" component="h1" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                            ساوملي
                        </Typography>
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                            {navItems.map((item) => (
                                <Button key={item.label} component="a" href={item.id} sx={{ color: 'text.primary' }}>
                                    {item.label}
                                </Button>
                            ))}
                            <Button variant="contained" href="#contact">
                                تواصل معنا
                            </Button>
                        </Box>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ display: { md: 'none' }, color: 'text.primary' }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                anchor="top"
                ModalProps={{ keepMounted: true }}
                sx={{ display: { xs: 'block', md: 'none' } }}
            >
                {drawer}
            </Drawer>
        </>
    );
}
export default Header;