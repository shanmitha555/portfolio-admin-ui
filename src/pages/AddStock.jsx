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
    MenuItem
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const AddStock = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const stockToEdit = location.state?.stock;
    const isEditing = !!stockToEdit;

    const [formData, setFormData] = useState({
        symbol: '',
        name: '',
        exchange: 'NSE',
        sector: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Populate form with stock data if editing
    useEffect(() => {
        if (stockToEdit) {
            setFormData({
                symbol: stockToEdit.symbol || '',
                name: stockToEdit.name || '',
                exchange: stockToEdit.exchange || '',
                sector: stockToEdit.sector || ''
            });
        }
    }, [stockToEdit]);

    const handleInputChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const url = isEditing ? `/api/stocks/${stockToEdit.id}` : '/api/stocks';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/stocks');
                }, 1500);
            } else {
                throw new Error(result.message || `Failed to ${isEditing ? 'update' : 'add'} stock`);
            }
        } catch (err) {
            console.error(`Error ${isEditing ? 'updating' : 'adding'} stock:`, err);
            setError(err.message || `Failed to ${isEditing ? 'update' : 'add'} stock. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/stocks');
    };

    if (success) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="success" sx={{ mb: 2 }}>
                    Stock {isEditing ? 'updated' : 'added'} successfully! Redirecting to stocks page...
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    sx={{ mr: 2 }}
                >
                    Back to Stocks
                </Button>
            </Box>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {isEditing ? 'Edit Stock' : 'Add New Stock'}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {isEditing ? 'Update stock information' : 'Enter stock details to add to the portfolio'}
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Stock {isEditing ? 'updated' : 'added'} successfully! Redirecting to stocks page...
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Stock Symbol"
                        name="symbol"
                        value={formData.symbol}
                        onChange={handleInputChange('symbol')}
                        required
                        sx={{ mb: 3 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        placeholder="e.g., AAPL"
                        inputProps={{ maxLength: 10 }}
                    />

                    <TextField
                        fullWidth
                        label="Stock Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange('name')}
                        required
                        sx={{ mb: 3 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        placeholder="e.g., Apple Inc."
                        inputProps={{ maxLength: 100 }}
                    />

                    <FormControl fullWidth required sx={{ mb: 3 }}>
                        <InputLabel id="exchange-label">Exchange</InputLabel>
                        <Select
                            value={formData.exchange}
                            label="Exchange"
                            onChange={handleInputChange('exchange')}
                            labelId="exchange-label"
                        >
                            <MenuItem value="NSE">NSE</MenuItem>
                            <MenuItem value="BSE">BSE</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth required sx={{ mb: 3 }}>
                        <InputLabel id="sector-label" shrink>Sector</InputLabel>
                        <Select
                            value={formData.sector}
                            label="Sector"
                            onChange={handleInputChange('sector')}
                            labelId="sector-label"
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                <em>Select a sector</em>
                            </MenuItem>
                            <MenuItem value="Banks">Banks</MenuItem>
                            <MenuItem value="ETF">ETF</MenuItem>
                            <MenuItem value="IT Services">IT Services</MenuItem>
                            <MenuItem value="Finance">Finance</MenuItem>
                            <MenuItem value="Hotels & Restaurants">Hotels & Restaurants</MenuItem>
                            <MenuItem value="Information Technology">Information Technology</MenuItem>
                            <MenuItem value="Infrastructure Developers & Operators">Infrastructure Developers & Operators</MenuItem>
                            <MenuItem value="Nifty Bank">Nifty Bank</MenuItem>
                            <MenuItem value="Paints">Paints</MenuItem>
                            <MenuItem value="Pharma & Healthcare">Pharma & Healthcare</MenuItem>
                            <MenuItem value="Refineries/Oil-Gas">Refineries/Oil-Gas</MenuItem>
                            <MenuItem value="Steel">Steel</MenuItem>
                            <MenuItem value="Tobacco Products">Tobacco Products</MenuItem>
                        </Select>
                    </FormControl>

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
                            {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Stock' : 'Add Stock')}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddStock;
