// pages/profile.js
import React, {useEffect} from 'react';
import { Box, Typography } from '@mui/material';
import {useLocation, useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

const ProfilePage = () => {
    const { handleRedirectCallback, isAuthenticated, user, loginWithRedirect } = useAuth0();
    const location = useLocation();
    const navigate = useNavigate();

    // Handling the redirect callback after login
    useEffect(() => {
        const handleAuthRedirect = async () => {
            if (location.search.includes('code=') && location.search.includes('state=')) {
                try {
                    await handleRedirectCallback(); // Complete the login process
                    navigate('/profile'); // Redirect to the home page or protected page after login
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
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Your Profile
            </Typography>
            <Typography variant="body1">
                Here you will see your user data, including graphs and stats.
            </Typography>
            {/* Placeholder for future graphs or charts */}
        </Box>
    );
};

export default ProfilePage;