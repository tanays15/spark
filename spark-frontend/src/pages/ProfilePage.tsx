// pages/profile.js
import React, { useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from '../components/Navbar'; // Import the Navbar component

const ProfilePage = () => {
    const { handleRedirectCallback, isAuthenticated } = useAuth0();
    const location = useLocation();
    const navigate = useNavigate();

    // Handling the redirect callback after login
    useEffect(() => {
        const handleAuthRedirect = async () => {
            if (location.search.includes('code=') && location.search.includes('state=')) {
                try {
                    await handleRedirectCallback();
                    navigate('/profile');
                } catch (error) {
                    console.error('Error during redirect callback:', error);
                }
            }
        };

        if (!isAuthenticated) {
            handleAuthRedirect();
        }
    }, [location, handleRedirectCallback, isAuthenticated, navigate]);

    if (!isAuthenticated) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h5">Loading...</Typography>
            </Box>
        );
    }

    return (
        <div>
            <Navbar /> {/* Navbar at the top, fully stretched */}

            {/* Page Content - Adding margin to prevent overlap with navbar */}
            <Container sx={{ mt: 12 }}> {/* Adjust margin-top to avoid navbar overlap */}
                <Typography variant="h4" gutterBottom>
                    Your Profile
                </Typography>
                <Typography variant="body1">
                    Here you will see your user data, including graphs and stats.
                </Typography>
            </Container>
        </div>
    );
};

export default ProfilePage;
