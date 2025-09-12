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

const AddStockPrice = () => {
    const navigate = useNavigate();
    const { stockSymbol } = useParams();
    const location = useLocation();
    const stock = location.state?.stock;

    const [formData, setFormData] = useState({
        price: '',
        recorded_at: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!stock) {
            navigate('/stocks');
        }
    }, [stock, navigate]);

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

        if (!formData.recorded_at) {
            setError('Please enter a valid date and time');
            return;
        }

        // Additional validation
        const parsedPrice = parseFloat(formData.price);
        const parsedDate = new Date(formData.recorded_at);

        if (isNaN(parsedDate.getTime())) {
            setError('Please enter a valid date and time');
            return;
        }

        console.log('Form validation passed:', {
            price: parsedPrice,
            recorded_at: formData.recorded_at,
            parsedDate: parsedDate.toISOString(),
            stock: stock
        });

        setLoading(true);
        setError(null);

        try {
            // Format date for timestamp (without timezone) - YYYY-MM-DD HH:MM:SS
            const dateValue = formData.recorded_at;
            const parsedDate = new Date(dateValue);

            // Format as timestamp without timezone: '2025-08-29 14:51:12'
            const year = parsedDate.getFullYear();
            const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
            const day = String(parsedDate.getDate()).padStart(2, '0');
            const hours = String(parsedDate.getHours()).padStart(2, '0');
            const minutes = String(parsedDate.getMinutes()).padStart(2, '0');
            const seconds = String(parsedDate.getSeconds()).padStart(2, '0');

            const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            const requestBody = {
                stock_id: stock.id,
                price: parseFloat(formData.price),
                recorded_at: timestamp
            };

            const response = await fetch('/api/stock-prices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response body:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate(`/stock-prices/${stock.symbol}`, { state: { stock } });
                }, 1500);
            } else {
                throw new Error(result.message || 'Failed to add stock price');
            }
        } catch (err) {
            console.error('Error adding stock price:', err);
            setError(`Failed to add stock price: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(`/stock-prices/${stock.symbol}`, { state: { stock } });
    };

    if (!stock) {
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
                    Add Stock Price: {stock.symbol} - {stock.name}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Add a new price record for this stock with date and time
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Stock price added successfully! Redirecting...
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
                        name="recorded_at"
                        type="datetime-local"
                        value={formData.recorded_at}
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
                            {loading ? 'Adding...' : 'Add Price'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddStockPrice;
