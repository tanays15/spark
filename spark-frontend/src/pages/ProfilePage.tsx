import {useEffect} from "react";
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from '../components/Navbar';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Typography } from "@mui/material"
import { Box } from "@mui/system";

const ProfilePage = () => {
    const { handleRedirectCallback, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const location = useLocation();
    const navigate = useNavigate();

    // Send user data to backend after sign-up
    useEffect(() => {
        const sendUserData = async () => {
            if (isAuthenticated && user) {
                try {
                    const token = await getAccessTokenSilently(); // Get Auth0 access token (if needed)
                    const response = await fetch("http://your-backend.com/api/users", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            email: user.email,
                            name: user.name,
                            sub: user.sub, // Auth0 user ID
                        }),
                    });

                    if (!response.ok) {
                        console.error("Failed to send user data");
                    }
                } catch (error) {
                    console.error("Error sending user data:", error);
                }
            }
        };

        sendUserData();
    }, [isAuthenticated, user, getAccessTokenSilently]);

    // Handle authentication redirect
    useEffect(() => {
        const handleAuthRedirect = async () => {
            if (location.search.includes("code=") && location.search.includes("state=")) {
                try {
                    await handleRedirectCallback();
                    navigate("/profile");
                } catch (error) {
                    console.error("Error during redirect callback:", error);
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
    // this data will be from the api
    const data = [
        { id: 1, name: "Alice", age: 25, city: "New York" },
        { id: 2, name: "Bob", age: 30, city: "Los Angeles" },
        { id: 3, name: "Charlie", age: 28, city: "Chicago" },
    ];

    return (
        <div>
            <Navbar />
            <Box display="flex" justifyContent="center" alignItems="flex-start" sx={{ height: 'calc(100vh - 75px)', width: '100vw' }}>
                <TableContainer component={Paper} sx={{ width: '90%', padding: 3 }}>
                    <Typography variant="h4" sx={{ padding: 2, textAlign: 'center', backgroundColor: '#1976d2', color: 'white', mb: 2 }}>
                        User Topics
                    </Typography>
                    <Table sx={{ width: '100%' }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', width: 'auto' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', width: 'auto' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', width: 'auto' }}>Age</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', width: 'auto' }}>City</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell sx={{ fontSize: '1rem', width: '25%' }}>{row.id}</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', width: '25%' }}>{row.name}</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', width: '25%' }}>{row.age}</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', width: '25%' }}>{row.city}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </div>)
    };

export default ProfilePage;
