import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    CircularProgress,
    InputAdornment
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const EditStockPrice = () => {
    const navigate = useNavigate();
    const { stockSymbol, priceId } = useParams();
    const location = useLocation();
    const { stock, price } = location.state || {};

    const [formData, setFormData] = useState({
        price: '',
        created_at: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!stock || !price) {
            navigate('/stocks');
            return;
        }

        // Pre-populate form with existing data
        const formatDateForInput = (dateString) => {
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) {
                    return '';
                }
                // Format for datetime-local input: YYYY-MM-DDTHH:MM
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return `${year}-${month}-${day}T${hours}:${minutes}`;
            } catch (error) {
                console.error('Error formatting date:', error);
                return '';
            }
        };

        setFormData({
            price: price.price.toString(),
            created_at: formatDateForInput(price.recorded_at)
        });
    }, [stock, price, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
            setError('Please enter a valid price');
            return;
        }

        if (!formData.created_at) {
            setError('Please enter a valid date and time');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Format date for timestamp (without timezone) - YYYY-MM-DD HH:MM:SS
            const dateValue = formData.created_at;
            const parsedDate = new Date(dateValue);

            // Format as timestamp without timezone: '2025-08-29 14:51:12'
            const year = parsedDate.getFullYear();
            const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
            const day = String(parsedDate.getDate()).padStart(2, '0');
            const hours = String(parsedDate.getHours()).padStart(2, '0');
            const minutes = String(parsedDate.getMinutes()).padStart(2, '0');
            const seconds = String(parsedDate.getSeconds()).padStart(2, '0');

            const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            const response = await fetch(`/api/stock-prices/${priceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    price: parseFloat(formData.price),
                    recorded_at: timestamp
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate(`/stock-prices/${stock.symbol}`, { state: { stock } });
                }, 1500);
            } else {
                throw new Error(result.message || 'Failed to update stock price');
            }
        } catch (err) {
            console.error('Error updating stock price:', err);
            setError(`Failed to update stock price: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(`/stock-prices/${stock.symbol}`, { state: { stock } });
    };

    if (!stock || !price) {
        return null;
    }

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    sx={{ mr: 2 }}
                >
                    Back to Stock Prices
                </Button>
            </Box>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Edit Stock Price: {stock.symbol} - {stock.name}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Edit the price record for this stock
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Stock price updated successfully! Redirecting...
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        sx={{ mb: 3 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        inputProps={{
                            step: "0.01",
                            min: "0"
                        }}
                        placeholder="Enter stock price"
                    />

                    <TextField
                        fullWidth
                        label="Date & Time"
                        name="created_at"
                        type="datetime-local"
                        value={formData.created_at}
                        onChange={handleInputChange}
                        required
                        sx={{ mb: 3 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            onClick={handleBack}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                            disabled={loading || success}
                        >
                            {loading ? 'Updating...' : 'Update Price'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default EditStockPrice;
