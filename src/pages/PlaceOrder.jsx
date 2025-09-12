import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    RadioGroup,
    Radio,
    FormLabel
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
    const navigate = useNavigate();
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        stock_id: '',
        action: 'BUY',
        price_per_unit: '',
        quantity: ''
    });

    // Fetch stocks for dropdown
    useEffect(() => {
        const fetchStocks = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/stocks');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                if (result.success && result.data) {
                    setStocks(result.data);
                } else {
                    throw new Error('Failed to fetch stocks data');
                }
            } catch (error) {
                console.error('Error fetching stocks:', error);
                setError('Failed to fetch stocks. Try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchStocks();
    }, []);

    const handleInputChange = (field) => (event) => {
        const value = event.target.value;

        // For quantity and price_per_unit fields, only allow positive decimal numbers
        if (field === 'quantity' || field === 'price_per_unit') {
            const numericValue = value.replace(/[^0-9.]/g, '');
            // Prevent multiple decimal points
            const parts = numericValue.split('.');
            const validValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;

            if (validValue === '' || (parseFloat(validValue) > 0)) {
                setFormData(prev => ({
                    ...prev,
                    [field]: validValue
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }

        // Clear error when user starts typing
        if (error) setError('');
        if (success) setSuccess('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validation
        if (!formData.stock_id) {
            setError('Please select a stock');
            return;
        }

        if (!formData.action) {
            setError('Please select an action (BUY or SELL)');
            return;
        }

        if (!formData.price_per_unit || parseFloat(formData.price_per_unit) <= 0) {
            setError('Please enter a valid price per unit (must be greater than 0)');
            return;
        }

        if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
            setError('Please enter a valid quantity (must be greater than 0)');
            return;
        }

        try {
            setSaving(true);
            setError('');

            // Prepare transaction data with correct field names
            const transactionData = {
                portfolio_id: '32b880f9-392b-4cc0-b590-f20809af0108', // Hardcoded as per requirements
                stock_id: formData.stock_id,
                type: formData.action, // Use 'type' as per database table field name
                price_per_unit: parseFloat(formData.price_per_unit),
                quantity: parseFloat(formData.quantity)
            };

            console.log('Sending transaction data:', transactionData);
            console.log('Form data before processing:', formData);
            console.log('JSON string being sent:', JSON.stringify(transactionData));

            // Additional validation logging
            console.log('Selected stock:', stocks.find(s => s.id === formData.stock_id));
            console.log('Stock ID validation:', formData.stock_id ? 'Valid' : 'Missing');
            console.log('Action validation:', formData.action ? 'Valid' : 'Missing');
            console.log('Price validation:', formData.price_per_unit ? 'Valid' : 'Missing');
            console.log('Quantity validation:', formData.quantity ? 'Valid' : 'Missing');

            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    console.error('Error response:', errorData);
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (parseError) {
                    console.error('Could not parse error response:', parseError);
                    const errorText = await response.text();
                    console.error('Raw error response:', errorText);
                    errorMessage = errorText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('Success response:', result);

            setSuccess(`Order placed successfully! ${formData.action} ${formData.quantity} shares of ${stocks.find(s => s.id === formData.stock_id)?.symbol} at ₹${formData.price_per_unit} per share`);

            // Reset form after successful submission
            setFormData({
                stock_id: '',
                action: 'BUY',
                price_per_unit: '',
                quantity: ''
            });

        } catch (error) {
            console.error('Error placing order:', error);
            setError(`Failed to place order: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };


    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
            <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                Place Order
            </Typography>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
                    Place a new order for stock trading
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {success}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <FormControl fullWidth required sx={{ mb: 3 }}>
                        <InputLabel id="stock-label" shrink>Stock</InputLabel>
                        <Select
                            value={formData.stock_id}
                            label="Stock"
                            onChange={handleInputChange('stock_id')}
                            labelId="stock-label"
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                <em>Select a stock</em>
                            </MenuItem>
                            {stocks.map((stock) => (
                                <MenuItem key={stock.id} value={stock.id}>
                                    {stock.symbol} - {stock.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl component="fieldset" required sx={{ mb: 3 }}>
                        <FormLabel component="legend" sx={{ mb: 1, color: 'text.primary' }}>
                            Action
                        </FormLabel>
                        <RadioGroup
                            value={formData.action}
                            onChange={handleInputChange('action')}
                            row
                        >
                            <FormControlLabel
                                value="BUY"
                                control={<Radio />}
                                label="BUY"
                            />
                            <FormControlLabel
                                value="SELL"
                                control={<Radio />}
                                label="SELL"
                            />
                        </RadioGroup>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Price Per Unit"
                        name="price_per_unit"
                        type="text"
                        value={formData.price_per_unit}
                        onChange={handleInputChange('price_per_unit')}
                        required
                        sx={{ mb: 3 }}
                        InputLabelProps={{ shrink: true }}
                        placeholder="Enter price per unit (e.g., 125.50, 2000.75)"
                        helperText="Enter a positive decimal value"
                    />

                    <TextField
                        fullWidth
                        label="Quantity"
                        name="quantity"
                        type="text"
                        value={formData.quantity}
                        onChange={handleInputChange('quantity')}
                        required
                        sx={{ mb: 3 }}
                        InputLabelProps={{ shrink: true }}
                        placeholder="Enter quantity (e.g., 10, 100.5)"
                        helperText="Enter a positive number"
                    />

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                            disabled={saving}
                        >
                            {saving ? 'Placing Order...' : 'Place Order'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default PlaceOrder;
