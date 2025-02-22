import React from 'react';
import { Box, Button, Typography, Container, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <Container maxWidth="lg">
            <Box
                display="flex"
                height="100vh"
                alignItems="center"
                justifyContent="center"
                bgcolor="black"
                color="white"
            >
                {/* Left side: Branding and login buttons */}
                <Box width="50%" textAlign="center">
                    <Typography variant="h2" fontWeight="bold" color="primary">
                        SPARK
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mb: 4 }}>
                        Know what you know, master what you don't
                    </Typography>

                    <Link to="/auth" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" color="primary" size="large" sx={{ mb: 2, width: '80%' }}>
                            Login
                        </Button>
                    </Link>

                    <Link to="/auth" style={{ textDecoration: 'none' }}>
                        <Button variant="outlined" color="secondary" size="large" sx={{ width: '80%' }}>
                            Sign Up
                        </Button>
                    </Link>
                </Box>

                {/* Right side: Demo preview section */}
                <Box width="50%" display="flex" justifyContent="center">
                    <Paper
                        elevation={3}
                        sx={{
                            width: '90%',
                            height: '60vh',
                            overflowY: 'auto',
                            p: 2,
                            bgcolor: '#f9f9f9',
                            color: 'black'
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold">
                            What is SPARK?
                        </Typography>
                        <Typography variant="body1" paragraph>
                            SPARK helps you improve speaking confidence by analyzing voice patterns, speech rate, and fluency.
                        </Typography>
                        <Typography variant="body1">
                            Scroll to learn more about how it works...
                        </Typography>
                    </Paper>
                </Box>
            </Box>
        </Container>
    );
};

export default LandingPage;
