import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../components/Navbar";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
} from "@mui/material";

const ProfilePage = () => {
    const {
        handleRedirectCallback,
        isAuthenticated,
        user,
        getAccessTokenSilently,
    } = useAuth0();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Send user data to backend after sign-up
    useEffect(() => {
        const sendUserData = async () => {
            if (isAuthenticated && user) {
                try {
                    const token = await getAccessTokenSilently(); // Get Auth0 access token (if needed)
                    const response = await fetch("http://localhost:5000/users", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            username: user.name,
                            auth0_id: user.sub, // Auth0 user ID
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

    // Fetch topics only after authentication
    useEffect(() => {
        const fetchData = async () => {
            if (isAuthenticated && user) {
                try {
                    const response = await fetch(
                        `http://localhost:5000/topics?username=${user.name}`
                    );
                    if (!response.ok) {
                        throw new Error("Failed to fetch data");
                    }
                    const data = await response.json();
                    setData(data);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [isAuthenticated, user]); // Only runs when authentication status or user changes

    // Handle authentication redirect
    useEffect(() => {
        const handleAuthRedirect = async () => {
            if (location.search.includes("code=") && location.search.includes("state=")) {
                try {
                    await handleRedirectCallback();
                    navigate( "/profile");
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <Navbar />
            <Box
                display="flex"
                justifyContent="center"
                alignItems="flex-start"
                sx={{ height: "calc(100vh - 75px)", width: "100vw" }}
            >
                <TableContainer component={Paper} sx={{ width: "90%", padding: 3 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            padding: 2,
                            textAlign: "center",
                            backgroundColor: "#1976d2",
                            color: "white",
                            mb: 2,
                        }}
                    >
                        Topics
                    </Typography>
                    <Table sx={{ width: "100%" }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", textAlign: "center" }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", textAlign: "center" }}>Avg Content Score</TableCell>
                                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", textAlign: "center" }}>Avg Confidence Score</TableCell>
                                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", textAlign: "center" }}>Avg Score</TableCell>
                                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", textAlign: "center" }}>Record Count</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data && data.length > 0 ? (
                                data.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell sx={{ fontSize: "1rem", textAlign: "center" }}>
                                            <Link to={`/analytics/${row.name}`} style={{ textDecoration: 'underline', color: 'inherit' }}>
                                                {row.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell sx={{ fontSize: "1rem", textAlign: "center" }}>{row.avg_content_score.toFixed(2)}</TableCell>
                                        <TableCell sx={{ fontSize: "1rem", textAlign: "center" }}>{row.average_confidence_score.toFixed(2)}</TableCell>
                                        <TableCell sx={{ fontSize: "1rem", textAlign: "center" }}>{row.avg_score.toFixed(2)}</TableCell>
                                        <TableCell sx={{ fontSize: "1rem", textAlign: "center" }}>{row.record_count}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ textAlign: "center" }}>No data available</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </div>
    );
};

export default ProfilePage;
