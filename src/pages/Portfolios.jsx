import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Alert,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip
} from '@mui/material';
import { TrendingUp, TrendingDown, Remove } from '@mui/icons-material';

const Portfolios = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [username, setUsername] = useState('Demo User');
    const [lastUpdated, setLastUpdated] = useState(null);
    const [portfolios, setPortfolios] = useState([
        {
            stock_symbol: 'AAPL',
            average_cost_price: 150.00,
            latest_market_price: 155.50,
            quantity: 100
        },
        {
            stock_symbol: 'GOOGL',
            average_cost_price: 2800.00,
            latest_market_price: 2750.00,
            quantity: 50
        }
    ]);

    // Hardcoded user_id as per requirements
    const userId = '7e525fdd-90da-479f-9d81-80b9cb6aa111';

    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                console.log('Fetching portfolios for user:', userId);
                const response = await fetch(`/api/portfolios/${userId}`);

                if (response.ok) {
                    const result = await response.json();
                    console.log('Portfolios API response:', result);

                    if (result.success && result.data && result.data.stocks) {
                        // Map the API response to our component format
                        const mappedStocks = result.data.stocks.map(stock => ({
                            stock_symbol: stock.stock_symbol,
                            average_cost_price: stock.average_cost_price,
                            latest_market_price: stock.current_market_price,
                            quantity: stock.quantity
                        }));

                        setPortfolios(mappedStocks);
                        setUsername(result.data.username || 'User');
                        setLastUpdated(new Date());
                        console.log('Portfolio data loaded:', mappedStocks);
                    } else {
                        console.log('API returned no stocks data, keeping demo data');
                    }
                } else {
                    console.log('API returned error status:', response.status, 'using demo data');
                }
            } catch (error) {
                console.log('API call failed:', error.message, 'using demo data');
            }
        };

        // Initial fetch only
        fetchPortfolios();
    }, [userId]);

    // Function to handle webhook updates (to be called when webhook is received)
    const handleWebhookUpdate = (updatedData) => {
        console.log('Webhook update received:', updatedData);
        if (updatedData && updatedData.stocks) {
            const mappedStocks = updatedData.stocks.map(stock => ({
                stock_symbol: stock.stock_symbol,
                average_cost_price: stock.average_cost_price,
                latest_market_price: stock.current_market_price,
                quantity: stock.quantity
            }));
            setPortfolios(mappedStocks);
            setUsername(updatedData.username || username);
            setLastUpdated(new Date());
            console.log('Portfolio data updated via webhook:', mappedStocks);
        }
    };

    console.log('Portfolios component rendering');

    // Helper functions for calculations and formatting
    const getPriceChangeIcon = (avgCost, latestPrice) => {
        if (avgCost === null || latestPrice === null || avgCost === undefined || latestPrice === undefined) {
            return <Remove color="disabled" />;
        }

        if (latestPrice > avgCost) {
            return <TrendingUp color="success" />;
        } else if (latestPrice < avgCost) {
            return <TrendingDown color="error" />;
        } else {
            return <Remove color="disabled" />;
        }
    };

    const getPriceChangeColor = (avgCost, latestPrice) => {
        if (avgCost === null || latestPrice === null || avgCost === undefined || latestPrice === undefined) {
            return 'default';
        }

        if (latestPrice > avgCost) {
            return 'success';
        } else if (latestPrice < avgCost) {
            return 'error';
        } else {
            return 'default';
        }
    };

    const calculateProfitLoss = (avgCost, latestPrice) => {
        if (avgCost === null || latestPrice === null || avgCost === undefined || latestPrice === undefined) {
            return null;
        }
        return ((latestPrice - avgCost) / avgCost) * 100;
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ ml: 2 }}>
                    Loading portfolios...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                Portfolios
            </Typography>

            {error && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" color="primary">
                            Portfolio for: {username}
                        </Typography>
                        {lastUpdated && (
                            <Typography variant="caption" color="text.secondary">
                                Last updated: {lastUpdated.toLocaleTimeString()}
                            </Typography>
                        )}
                    </Box>
                </Box>

                <TableContainer>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    Stock Symbol
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    Average Cost Price
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    Latest Market Price
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    P&L %
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    Status
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {portfolios.map((portfolio, index) => {
                                const profitLoss = calculateProfitLoss(
                                    portfolio.average_cost_price,
                                    portfolio.latest_market_price
                                );

                                return (
                                    <TableRow key={portfolio.stock_symbol || index} hover>
                                        <TableCell sx={{ fontWeight: 'medium' }}>
                                            {portfolio.stock_symbol}
                                        </TableCell>
                                        <TableCell>
                                            ₹{portfolio.average_cost_price?.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            ₹{portfolio.latest_market_price?.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            {profitLoss !== null ? (
                                                <Chip
                                                    label={`${profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)}%`}
                                                    color={getPriceChangeColor(
                                                        portfolio.average_cost_price,
                                                        portfolio.latest_market_price
                                                    )}
                                                    size="small"
                                                />
                                            ) : (
                                                'N/A'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {getPriceChangeIcon(
                                                portfolio.average_cost_price,
                                                portfolio.latest_market_price
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary">
                        Total Holdings: {portfolios.length} stocks
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default Portfolios;