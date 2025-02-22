// pages/dashboard.js
import React, { useState } from 'react';
import { Box, Typography, LinearProgress, Button } from '@mui/material';
//import Navbar from '../components/Navbar'

const DashboardPage = () => {
    const [score, setScore] = useState(75); // Example score

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Welcome to SPARK
            </Typography>
            {/* Video Box */}
            <Box width="100%" height="300px" bgcolor="#f0f0f0" mb={2}>
                <Typography align="center" pt={10}>
                    Video Box (Camera + Recording)
                </Typography>
            </Box>

            {/* Feedback and Progress */}
            <Box display="flex" flexDirection="row" justifyContent="space-between">
                <Box width="70%">
                    <Typography variant="h6">Text Feedback</Typography>
                    <Typography variant="body1">
                        Here will be the text feedback from the backend.
                    </Typography>
                </Box>

                <Box width="30%">
                    <LinearProgress variant="determinate" value={score} />
                    <Typography variant="caption" align="center">{score}%</Typography>
                </Box>
            </Box>

            {/* Subscores and Resources */}
            <Box mt={4}>
                <Typography variant="h6">Subscores:</Typography>
                <ul>
                    <li>Pitch: 80</li>
                    <li>Speech Rate: 70</li>
                    <li>Stuttering: 90</li>
                </ul>
                <Typography variant="h6">Resources:</Typography>
                <ul>
                    <li>Resource 1</li>
                    <li>Resource 2</li>
                </ul>
            </Box>
        </Box>
    );
};

export default DashboardPage;