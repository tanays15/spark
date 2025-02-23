import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Grid, Paper, Container, Link, CircularProgress } from "@mui/material";
import Navbar from "../components/Navbar"; // Import Navbar
import Confetti from "react-confetti";

interface ResultData {
    contentScore: number;
    visualScore: number;
    audioScore: number;
    score: number;
    feedback: string;
    resources: { title: string; url: string }[];
}

const Results: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get ID from URL
    const [data, setData] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Temporarily comment out the API call logic
    // useEffect(() => {
    //     const fetchData = async () => {
    //         setLoading(true); // Show loading spinner

    //         try {
    //             const response = await fetch(`https://api.example.com/data?id=${id}`, {
    //                 method: "GET",
    //                 headers: { "Content-Type": "application/json" }
    //             });

    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! Status: ${response.status}`);
    //             }

    //             const result: ResultData = await response.json();
    //             setData(result);
    //         } catch (error) {
    //             setError("Failed to fetch data. Please try again.");
    //         } finally {
    //             setLoading(false); // Hide loading spinner
    //         }
    //     };

    //     if (id) fetchData();
    // }, [id]); // Runs when `id` changes

    // Use mock data to simulate API response
    useEffect(() => {
        // Mocking data for the demonstration
        setTimeout(() => {
            setData({
                contentScore: 85,
                visualScore: 92,
                audioScore: 88,
                score: 90,
                feedback: "Great presentation! Your speech was clear, and your vision was spot on. Keep it up!",
                resources: [
                    { title: "Effective Public Speaking", url: "https://www.example.com/speech" },
                    { title: "Improving Your Vision", url: "https://www.example.com/vision" }
                ]
            });
            setLoading(false);
        }, 1000); // Simulating loading time
    }, []);

    return (
        <>
            {/* Navbar */}
            <Navbar />

            {/* Full Page Layout */}
            <Box sx={{ width: "100vw", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "80px", backgroundColor: "#1b2034" }}>
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
                            {/* Show Confetti if Total Score is 90 */}
                            {data.score >= 70 && <Confetti width={window.innerWidth} height={window.innerHeight} />}

                            {/* Scores Section */}
                            <Grid container spacing={4} justifyContent="center">
                                {/* Content Score */}
                                <Grid item xs={12} sm={4}>
                                    <Paper elevation={5}
                                           sx={{
                                               padding: 4, textAlign: "center", height: "150px",
                                               display: "flex", flexDirection: "column", justifyContent: "center",
                                               borderRadius: "12px", backgroundColor: "#d75a5a", color: "white",
                                               border: "2px solid white",
                                           }}
                                    >
                                        <Typography variant="h5" fontWeight="bold">Content Score</Typography>
                                        <Typography variant="h4">{data.contentScore}/100</Typography>
                                    </Paper>
                                </Grid>

                                {/* Visual Score */}
                                <Grid item xs={12} sm={4}>
                                    <Paper elevation={5}
                                           sx={{
                                               padding: 4, textAlign: "center", height: "150px",
                                               display: "flex", flexDirection: "column", justifyContent: "center",
                                               borderRadius: "12px", backgroundColor: "#43c088", color: "#fff",
                                               border: "2px solid white",
                                           }}
                                    >
                                        <Typography variant="h5" fontWeight="bold">Visual Score</Typography>
                                        <Typography variant="h4">{data.visualScore}/100</Typography>
                                    </Paper>
                                </Grid>

                                {/* Audio Score */}
                                <Grid item xs={12} sm={4}>
                                    <Paper elevation={5}
                                           sx={{
                                               padding: 4, textAlign: "center", height: "150px",
                                               display: "flex", flexDirection: "column", justifyContent: "center",
                                               borderRadius: "12px", backgroundColor: "#64b5f6", color: "#fff",
                                               border: "2px solid white",
                                           }}
                                    >
                                        <Typography variant="h5" fontWeight="bold">Audio Score</Typography>
                                        <Typography variant="h4">{data.audioScore}/100</Typography>
                                    </Paper>
                                </Grid>

                                {/* Total Score */}
                                <Grid item xs={12}>
                                    <Paper elevation={6}
                                           sx={{
                                               padding: 4, textAlign: "center", height: "150px",
                                               display: "flex", flexDirection: "column", justifyContent: "center",
                                               borderRadius: "12px", backgroundColor: "#ff7043", color: "#fff",
                                               border: "2.5px solid white",
                                           }}
                                    >
                                        <Typography variant="h4" fontWeight="bold" color="#fff">Total Score</Typography>
                                        <Typography variant="h3" fontWeight="bold" sx={{ marginTop: 2 }}>
                                            {data.score}/100
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontStyle: "italic", marginTop: 1 }}>
                                            Calculated from Content, Visual, and Audio Scores
                                        </Typography>
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