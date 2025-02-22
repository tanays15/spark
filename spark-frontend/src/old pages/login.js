// pages/login.js
import React from 'react';
import { Button, TextField, Container, Box, Typography } from '@mui/material';

const LoginPage = () => {
    return (
        <Container maxWidth="xs">
            <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
                <Typography variant="h4" gutterBottom>Login</Typography>
                <TextField label="Email" variant="outlined" fullWidth margin="normal" />
                <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" />
                <Button variant="contained" color="primary" fullWidth>
                    Log In
                </Button>
            </Box>
        </Container>
    );
};

export default LoginPage;