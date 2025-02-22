// pages/profile.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const ProfilePage = () => {
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