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
    IconButton,
    Tooltip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { Edit, Delete, Add, ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const StockPrices = () => {
    const navigate = useNavigate();
    const { stockSymbol } = useParams();
    const location = useLocation();
    const stock = location.state?.stock;

    const [stockPrices, setStockPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [priceToDelete, setPriceToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (stock) {
            fetchStockPrices();
        }
    }, [stock]);

    const fetchStockPrices = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/stock-prices/${stock.id}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                // Sort by date/time in descending order (latest first)
                const sortedPrices = result.data.sort((a, b) =>
                    new Date(b.recorded_at) - new Date(a.recorded_at)
                );
                console.log('Stock prices data:', sortedPrices);
                console.log('Sample date format:', sortedPrices[0]?.recorded_at);
                console.log('Parsed date:', new Date(sortedPrices[0]?.recorded_at));
                console.log('Full structure of first price record:', sortedPrices[0]);
                console.log('Available fields:', Object.keys(sortedPrices[0] || {}));
                setStockPrices(sortedPrices);
                setError(null);
            } else {
                throw new Error('API returned unsuccessful response');
            }
        } catch (err) {
            console.error('Error fetching stock prices:', err);
            setError('Failed to fetch stock prices. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddPrice = () => {
        navigate(`/add-stock-price/${stock.symbol}`, { state: { stock } });
    };

    const handleEditPrice = (price) => {
        navigate(`/edit-stock-price/${stock.symbol}/${price.id}`, {
            state: { stock, price }
        });
    };

    const handleDeletePrice = (price) => {
        setPriceToDelete(price);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!priceToDelete) return;

        setDeleteLoading(true);
        try {
            const response = await fetch(`/api/stock-prices/${priceToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                // Remove the deleted price from the list
                setStockPrices(prev => prev.filter(price => price.id !== priceToDelete.id));
                setDeleteDialogOpen(false);
                setPriceToDelete(null);
            } else {
                throw new Error(result.message || 'Failed to delete stock price');
            }
        } catch (err) {
            console.error('Error deleting stock price:', err);
            alert(`Failed to delete stock price: ${err.message}`);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setPriceToDelete(null);
    };

    const handleBackToStocks = () => {
        navigate('/stocks');
    };

    const formatDateTime = (dateTimeString) => {
        try {
            console.log('Formatting date:', dateTimeString);

            if (!dateTimeString) {
                return 'No date';
            }

            // Try different date parsing approaches
            let date;

            // First, try direct parsing
            date = new Date(dateTimeString);

            // If that fails, try parsing as ISO string
            if (isNaN(date.getTime())) {
                // Remove timezone info if present and try again
                const cleanDateString = dateTimeString.replace(/[+-]\d{2}:\d{2}$/, '');
                date = new Date(cleanDateString);
            }

            // If still fails, try parsing as timestamp
            if (isNaN(date.getTime())) {
                const timestamp = parseInt(dateTimeString);
                if (!isNaN(timestamp)) {
                    date = new Date(timestamp);
                }
            }

            if (isNaN(date.getTime())) {
                console.error('Could not parse date:', dateTimeString);
                return 'Invalid date';
            }

            console.log('Successfully parsed date:', date);
            return date.toLocaleString();
        } catch (error) {
            console.error('Error formatting date:', error, 'Input:', dateTimeString);
            return 'Invalid date';
        }
    };

    if (!stock) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                Stock information not found. Please go back to stocks page.
            </Alert>
        );
    }

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
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={handleBackToStocks}
                        sx={{ mr: 2 }}
                    >
                        Back to Stocks
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1">
                        Stock Prices: {stock.symbol} - {stock.name}
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleAddPrice}
                        sx={{ minWidth: 'auto', px: 2 }}
                    >
                        Add Price
                    </Button>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    View and manage price history for {stock.symbol} ({stockPrices.length} records)
                </Typography>
            </Box>

            <Paper sx={{ width: '100%', overflow: 'auto', borderRadius: 0 }}>
                <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)' }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', width: '200px' }}>Date/Time</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: '150px' }}>Price</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: '120px' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stockPrices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        <Typography variant="body2" color="text.secondary">
                                            No price records found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                stockPrices.map((price) => (
                                    <TableRow key={price.id} hover>
                                        <TableCell>{formatDateTime(price.recorded_at)}</TableCell>
                                        <TableCell>
                                            <Typography variant="body1" fontWeight="medium">
                                                ₹{price.price}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Tooltip title="Edit Price">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleEditPrice(price)}
                                                    >
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Price">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDeletePrice(price)}
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
                        This will delete the stock price permanently. Want to continue?
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

export default StockPrices;
