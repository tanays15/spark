// pages/index.js
import React from 'react';
import { Button, Box, Typography, Container } from '@mui/material';

const LandingPage = () => {
    return (
        <Container maxWidth="lg">
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" height="100vh">
                <Box width="50%" textAlign="center">
                    <Typography variant="h2" component="h1" gutterBottom>
                        SPARK
                    </Typography>
                    <Button variant="contained" color="primary" fullWidth>
                        Login
                    </Button>
                    <Button variant="outlined" color="secondary" fullWidth>
                        Sign Up
                    </Button>
                </Box>
                <Box width="50%">
                    {/* Right side for the product demo (scrollable) */}
                    <Typography variant="h6" paragraph>
                        SPARK helps you improve your speaking confidence by analyzing speech.
                    </Typography>
                    <Box
                        style={{
                            width: '100%',
                            height: '200px',
                            backgroundColor: '#f0f0f0',
                            overflowY: 'scroll',
                            padding: '10px',
                        }}
                    >
                        <Typography variant="body1">
                            Scroll to learn more about how SPARK works...
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default LandingPage;