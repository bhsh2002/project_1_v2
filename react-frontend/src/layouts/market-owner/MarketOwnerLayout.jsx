import { useState, useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { AuthContext } from '../../context/AuthContext';
import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemButton, ListItemText, ListItemIcon, IconButton, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import QrCodeIcon from '@mui/icons-material/QrCode';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    overflowX: 'auto',
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function MarketOwnerLayout() {
    const [open, setOpen] = useState(true);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        { text: 'لوحة التحكم', icon: <DashboardIcon />, link: '/market-owner/dashboard' },
        { text: 'المنتجات', icon: <InventoryIcon />, link: '/market-owner/products' },
        { text: 'الرفوف', icon: <ViewQuiltIcon />, link: '/market-owner/shelves' },
        { text: 'رفع جماعي', icon: <UploadFileIcon />, link: '/market-owner/bulk-upload' },
        { text: 'مولد رمز QR', icon: <QrCodeIcon />, link: '/market-owner/qr-generator' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton color="inherit" edge="start" onClick={handleDrawerOpen} sx={{ mr: 2, ...(open && { display: 'none' }) }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        لوحة تحكم المتجر
                    </Typography>
                    <Typography>مرحباً، {user?.username}</Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="persistent"
                anchor="left"
                open={open}
                sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton component={Link} to={item.link}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout}>
                            <ListItemIcon><LogoutIcon /></ListItemIcon>
                            <ListItemText primary="تسجيل الخروج" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Main>
                <DrawerHeader />
                <Outlet />
            </Main>
        </Box>
    );
}