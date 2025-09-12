import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const location = useLocation();
    const isStocksPage = location.pathname === '/stocks';

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Header />
            <Box sx={{ display: 'flex', flex: 1, marginTop: '64px' }}>
                <Sidebar />
                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        p: isStocksPage ? 0 : 1,
                        overflowX: 'auto',
                        minWidth: 0, // Allow flex item to shrink below content size
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;
