import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Grid, Paper, Container, Link, CircularProgress } from "@mui/material";
import Navbar from "../components/Navbar"; // Import Navbar

interface ResultData {
    speech: number;
    vision: number;
    audio: number;
    feedback: string;
    resources: { title: string; url: string }[];
}

const Results: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get ID from URL
    const [data, setData] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Show loading spinner

            try {
                const response = await fetch(`https://api.example.com/data?id=${id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result: ResultData = await response.json();
                setData(result);
            } catch (error) {
                setError("Failed to fetch data. Please try again.");
            } finally {
                setLoading(false); // Hide loading spinner
            }
        };

        if (id) fetchData();
    }, [id]); // Runs when `id` changes

    return (
        <>
            {/* Navbar */}
            <Navbar />

            {/* Full Page Layout */}
            <Box sx={{ width: "100vw", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "80px", backgroundColor: "#f4f6f8" }}>
                <Container maxWidth="md">
                    
                    {/* Show Loading Spinner */}
                    {loading && (
                        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                            <CircularProgress size={60} thickness={5} />
                        </Box>
                    )}

                    {/* Show Error Message */}
                    {error && (
                        <Typography variant="h6" color="error" textAlign="center">
                            {error}
                        </Typography>
                    )}

                    {/* Show Data Once Loaded */}
                    {!loading && data && (
                        <>
                            {/* Scores Section */}
                            <Grid container spacing={4} justifyContent="center">
                                {/* Speech Score */}
                                <Grid item xs={12} sm={4}>
                                    <Paper elevation={5}
                                        sx={{
                                            padding: 4, textAlign: "center", height: "150px",
                                            display: "flex", flexDirection: "column", justifyContent: "center",
                                            borderRadius: "12px", backgroundColor: "#ffcc80", color: "#333"
                                        }}
                                    >
                                        <Typography variant="h5" fontWeight="bold">Speech Score</Typography>
                                        <Typography variant="h4">{data.speech}/100</Typography>
                                    </Paper>
                                </Grid>

                                {/* Vision Score */}
                                <Grid item xs={12} sm={4}>
                                    <Paper elevation={5}
                                        sx={{
                                            padding: 4, textAlign: "center", height: "150px",
                                            display: "flex", flexDirection: "column", justifyContent: "center",
                                            borderRadius: "12px", backgroundColor: "#81c784", color: "#fff"
                                        }}
                                    >
                                        <Typography variant="h5" fontWeight="bold">Audio/Vision Score</Typography>
                                        <Typography variant="h4">{data.vision}/100</Typography>
                                    </Paper>
                                </Grid>

                                {/* Audio Score */}
                                <Grid item xs={12} sm={4}>
                                    <Paper elevation={5}
                                        sx={{
                                            padding: 4, textAlign: "center", height: "150px",
                                            display: "flex", flexDirection: "column", justifyContent: "center",
                                            borderRadius: "12px", backgroundColor: "#64b5f6", color: "#fff"
                                        }}
                                    >
                                        <Typography variant="h5" fontWeight="bold">Total Score</Typography>
                                        <Typography variant="h4">{data.audio}/100</Typography>
                                    </Paper>
                                </Grid>
                            </Grid>

                            {/* Feedback Section */}
                            <Box sx={{ marginTop: 5, padding: 3, backgroundColor: "#fff", borderRadius: "12px", boxShadow: 3 }}>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    Feedback
                                </Typography>
                                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                    {data.feedback}
                                </Typography>
                            </Box>

                            {/* Resource Links Section */}
                            <Box sx={{ marginTop: 5, padding: 3, backgroundColor: "#fff", borderRadius: "12px", boxShadow: 3 }}>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    Suggested Resources
                                </Typography>
                                {data.resources.map((resource, index) => (
                                    <Typography key={index}>
                                        <Link href={resource.url} target="_blank" rel="noopener noreferrer"
                                            sx={{ color: "#1976d2", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                                        >
                                            {resource.title}
                                        </Link>
                                    </Typography>
                                ))}
                            </Box>
                        </>
                    )}
                </Container>
            </Box>
        </>
    );
};

export default Results;
