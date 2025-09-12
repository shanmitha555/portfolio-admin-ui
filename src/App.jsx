import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Stocks from './pages/Stocks';
import AddStock from './pages/AddStock';
import StockPrices from './pages/StockPrices';
import AddStockPrice from './pages/AddStockPrice';
import EditStockPrice from './pages/EditStockPrice';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="/add-stock" element={<AddStock />} />
            <Route path="/stock-prices/:stockSymbol" element={<StockPrices />} />
            <Route path="/add-stock-price/:stockSymbol" element={<AddStockPrice />} />
            <Route path="/edit-stock-price/:stockSymbol/:priceId" element={<EditStockPrice />} />
            <Route path="/portfolios" element={<div>Portfolios Page (Coming Soon)</div>} />
            <Route path="/users" element={<div>Users Page (Coming Soon)</div>} />
            <Route path="/settings" element={<div>Settings Page (Coming Soon)</div>} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
