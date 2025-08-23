import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
    Chip
} from '@mui/material';

const Stocks = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [count, setCount] = useState(0);

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/stocks');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setStocks(result.data);
                setCount(result.count);
                setError(null);
            } else {
                throw new Error('API returned unsuccessful response');
            }
        } catch (err) {
            console.error('Error fetching stocks:', err);
            setError('Failed to fetch stocks. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Stocks Management
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                View and manage all stocks in the portfolio system ({count} stocks)
            </Typography>

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Symbol</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Exchange</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Sector</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stocks.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <Typography variant="body2" color="text.secondary">
                                            No stocks found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                stocks.map((stock) => (
                                    <TableRow key={stock.symbol} hover>
                                        <TableCell>
                                            <Chip
                                                label={stock.symbol}
                                                color="primary"
                                                variant="outlined"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{stock.name}</TableCell>
                                        <TableCell>{stock.exchange}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={stock.sector}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default Stocks;
