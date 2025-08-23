import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <Header />
            <Sidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    marginTop: '64px', // Account for header height
                    marginLeft: '240px', // Account for sidebar width
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
