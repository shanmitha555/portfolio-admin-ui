import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Box
} from '@mui/material';
import {
    Dashboard,
    ShowChart,
    AccountBalance,
    People,
    Settings,
    ShoppingCart
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Stocks', icon: <ShowChart />, path: '/stocks' },
    { text: 'Place Order', icon: <ShoppingCart />, path: '/place-order' },
    { text: 'Portfolios', icon: <AccountBalance />, path: '/portfolios' },
    { text: 'Users', icon: <People />, path: '/users' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
];

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    position: 'relative',
                },
            }}
        >
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                selected={location.pathname === item.path}
                                onClick={() => navigate(item.path)}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
            </Box>
        </Drawer>
    );
};

export default Sidebar;
