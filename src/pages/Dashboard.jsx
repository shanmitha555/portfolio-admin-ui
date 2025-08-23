import { Box, Typography, Grid, Paper, Card, CardContent } from '@mui/material';
import { ShowChart, AccountBalance, People, TrendingUp } from '@mui/icons-material';

const Dashboard = () => {
    const stats = [
        { title: 'Total Stocks', value: '150+', icon: <ShowChart />, color: '#1976d2' },
        { title: 'Active Portfolios', value: '25', icon: <AccountBalance />, color: '#388e3c' },
        { title: 'Registered Users', value: '1,250', icon: <People />, color: '#f57c00' },
        { title: 'Total Value', value: '$2.5M', icon: <TrendingUp />, color: '#7b1fa2' },
    ];

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Welcome to the Portfolio Admin Dashboard
            </Typography>

            <Grid container spacing={3}>
                {stats.map((stat) => (
                    <Grid item xs={12} sm={6} md={3} key={stat.title}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography color="text.secondary" gutterBottom>
                                            {stat.title}
                                        </Typography>
                                        <Typography variant="h4" component="div">
                                            {stat.value}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ color: stat.color }}>
                                        {stat.icon}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Quick Actions
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            • View and manage stocks<br />
                            • Monitor portfolio performance<br />
                            • Manage user accounts<br />
                            • Update system settings
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Activity
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            • New stock added: AAPL<br />
                            • Portfolio updated: Growth Fund<br />
                            • User registered: john.doe@example.com<br />
                            • System backup completed
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
