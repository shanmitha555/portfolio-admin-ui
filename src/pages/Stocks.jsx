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
    Chip,
    Checkbox,
    IconButton,
    Tooltip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { Edit, Delete, Visibility, Add, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Stocks = () => {
    const navigate = useNavigate();
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [count, setCount] = useState(0);
    const [selectedStocks, setSelectedStocks] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [stockToDelete, setStockToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

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

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedStocks(stocks.map(stock => stock.id));
        } else {
            setSelectedStocks([]);
        }
    };

    const handleSelectStock = (stockId) => {
        setSelectedStocks(prev =>
            prev.includes(stockId)
                ? prev.filter(id => id !== stockId)
                : [...prev, stockId]
        );
    };

    const handleRowClick = (stock) => {
        setSelectedStock(stock);
    };

    const handleEditStock = (stock) => {
        setSelectedStock(stock);
        navigate('/add-stock', { state: { stock } });
    };

    const handleDeleteStock = (stock) => {
        setStockToDelete(stock);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!stockToDelete) return;

        setDeleteLoading(true);
        try {
            // Use symbol for deletion since it's unique
            const url = `/api/stocks/${stockToDelete.symbol}`;
            console.log('Attempting to delete stock at URL:', url);
            console.log('Stock to delete:', stockToDelete);

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Delete response status:', response.status);
            console.log('Delete response headers:', response.headers);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                // Remove the deleted stock from the list
                setStocks(prev => prev.filter(stock => stock.id !== stockToDelete.id));
                setCount(prev => prev - 1);

                // Clear selection if the deleted stock was selected
                if (selectedStock?.id === stockToDelete.id) {
                    setSelectedStock(null);
                }

                setDeleteDialogOpen(false);
                setStockToDelete(null);
            } else {
                throw new Error(result.message || 'Failed to delete stock');
            }
        } catch (err) {
            console.error('Error deleting stock:', err);
            alert(`Failed to delete stock: ${err.message}`);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setStockToDelete(null);
    };

    const handleViewStock = (stock) => {
        setSelectedStock(stock);
        // TODO: Open view modal
        console.log('View stock:', stock);
    };

    const handleViewStockPrices = (stock) => {
        navigate(`/stock-prices/${stock.symbol}`, { state: { stock } });
    };

    const handleAddStock = () => {
        navigate('/add-stock');
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
        <Box sx={{ width: '100%', minWidth: 'fit-content' }}>
            <Box sx={{ px: 2, pb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1">
                        Stocks Management
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleAddStock}
                        sx={{ minWidth: 'auto', px: 2 }}
                    >
                        Add Stock
                    </Button>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    View and manage all stocks in the portfolio system ({count} stocks)
                </Typography>
            </Box>

            <Paper sx={{ width: '100%', overflow: 'auto', borderRadius: 0 }}>
                {selectedStock && (
                    <Box sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
                        <Typography variant="subtitle1">
                            Selected: {selectedStock.symbol} - {selectedStock.name}
                        </Typography>
                    </Box>
                )}
                <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)' }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox" sx={{ width: '50px' }}>
                                    <Checkbox
                                        indeterminate={selectedStocks.length > 0 && selectedStocks.length < stocks.length}
                                        checked={stocks.length > 0 && selectedStocks.length === stocks.length}
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: '120px' }}>Symbol</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', minWidth: '150px' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: '100px' }}>Exchange</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: '120px' }}>Sector</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: '120px' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stocks.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography variant="body2" color="text.secondary">
                                            No stocks found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                stocks.map((stock) => (
                                    <TableRow
                                        key={stock.symbol}
                                        hover
                                        selected={selectedStock?.id === stock.id}
                                        onClick={() => handleRowClick(stock)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedStocks.includes(stock.id)}
                                                onChange={() => handleSelectStock(stock.id)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </TableCell>
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
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Tooltip title="View Details">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleViewStock(stock);
                                                        }}
                                                    >
                                                        <Visibility fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="View Stock Prices">
                                                    <IconButton
                                                        size="small"
                                                        color="secondary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleViewStockPrices(stock);
                                                        }}
                                                    >
                                                        <TrendingUp fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit Stock">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditStock(stock);
                                                        }}
                                                    >
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Stock">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteStock(stock);
                                                        }}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCancelDelete}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        The stock <strong>{stockToDelete?.symbol} - {stockToDelete?.name}</strong> will be permanently deleted. Want to continue?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCancelDelete}
                        disabled={deleteLoading}
                        color="primary"
                    >
                        No
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        disabled={deleteLoading}
                        color="error"
                        variant="contained"
                        startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
                    >
                        {deleteLoading ? 'Deleting...' : 'Yes'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Stocks;

