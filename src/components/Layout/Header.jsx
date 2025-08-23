import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

const Header = () => {
    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Portfolio Admin Dashboard
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountCircle />
                    <Typography variant="body2">Admin User</Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
