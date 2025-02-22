import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Container, Grid, Paper, Slide } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { useTheme } from '@mui/material/styles';

const slides = [
    {
        title: "What is SPARK?",
        content: "Our mission is to help individuals build confidence and clarity in their communication by providing real-time analysis of their speech. Using advanced AI, our platform evaluates facial expressions, voice patterns, and speech content to assess a speaker’s confidence when explaining a topic. By transcribing speech, verifying correctness with GPT-4, and generating a confidence score, we offer users valuable feedback to refine their delivery. With secure login and progress tracking, we enable users to monitor their growth over time, fostering continuous improvement and mastery in their ability to articulate ideas with confidence."
    },
    {
        title: "How SPARK Works",
        content: "SPARK uses facial recognition, speech pattern analysis, and real-time transcription to evaluate confidence. Our advanced algorithms process each element to generate a feedback score that is accurate and actionable. This helps individuals adjust their delivery and gain insights into their communication style."
    },
    {
        title: "Track Your Progress",
        content: "With SPARK, you can track your progress over time. Our platform provides insights into your improvement, helping you see how your speech evolves as you practice. With our secure login system, you can always come back and measure your confidence in real-time."
    }
];

const LandingPage: React.FC = () => {
    const { loginWithRedirect } = useAuth0();
    const theme = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");

    // Auto-scrolling functionality
    useEffect(() => {
        const intervalId = setInterval(() => {
            setSlideDirection("left");
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(intervalId); // Clean up on component unmount
    }, []);

    const handleNext = () => {
        setSlideDirection("left");
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const handlePrev = () => {
        setSlideDirection("right");
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                overflow: "hidden",
            }}
        >
            <Container maxWidth="xl" sx={{ height: "100%" }}>
                <Grid container sx={{ height: "100%" }} alignItems="center">
                    {/* Left Side */}
                    <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
                        <Typography variant="h2" fontWeight="bold" color="primary">
                            SPARK
                        </Typography>
                        <Typography variant="subtitle1" sx={{ mb: 4 }}>
                            Know what you know, master what you don't
                        </Typography>

                        {/* Login Button - Sends user to Auth0 for authentication */}
                        <Button
                            variant="contained"
                            size="large"
                            color="primary"
                            fullWidth
                            sx={{ mb: 2, maxWidth: "400px", fontSize: 15 }}
                            onClick={() => loginWithRedirect()}
                        >
                            Login
                        </Button>

                        {/* Sign-Up Button */}
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            sx={{ backgroundColor: "#005e0d", maxWidth: "400px", fontFamily: "Arial", fontSize: 15 }}
                            onClick={() =>
                                loginWithRedirect({
                                    authorizationParams: { screen_hint: "signup" },
                                })
                            }
                        >
                            Sign Up
                        </Button>
                    </Grid>

                    {/* Right Side - Slideshow Section */}
                    <Grid item xs={12} md={6} sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        p: 3
                    }}>
                        <Paper
                            elevation={3}
                            sx={{
                                width: "90%",
                                maxWidth: "500px",
                                height: "80%",
                                p: 3,
                                bgcolor: "#f5f5f5",
                                color: "black",
                                textAlign: "center",
                                border: "5px solid #005e0d",
                                borderRadius: 3,
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            <Slide direction={slideDirection} in={true} timeout={500}>
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        padding: "20px",
                                        boxSizing: "border-box", // Ensure padding is included in the height
                                    }}
                                >
                                    <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ fontFamily: "Helvetica Neue" }}>
                                        {slides[currentIndex].title}
                                    </Typography>
                                    <Typography variant="body1" paragraph sx={{ fontFamily: "Helvetica Neue" }}>
                                        {slides[currentIndex].content}
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        fontWeight="medium"
                                        sx={{
                                            fontFamily: "Helvetica Neue",
                                            fontSize: 25,
                                            cursor: 'pointer',
                                            color: '#3874cb',
                                            textDecoration: 'underline'
                                        }}
                                        onClick={() =>
                                            loginWithRedirect({
                                                authorizationParams: { screen_hint: "signup" },
                                            })
                                        }
                                    >
                                        Sign up to learn more!
                                    </Typography>

                                    {/* Navigation buttons */}
                                    <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                                        <Button
                                            onClick={handlePrev}
                                            variant="contained"
                                            sx={{ mr: 2 }}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            onClick={handleNext}
                                            variant="contained"
                                        >
                                            Next
                                        </Button>
                                    </Box>
                                </div>
                            </Slide>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default LandingPage;