import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Container, Grid, Paper, Slide } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

const slides = [
    {
        title: "What is SPARK?",
        content: "Our mission is to help individuals build confidence and clarity in their communication by providing real-time analysis of their speech. Using advanced AI, our platform evaluates facial expressions, voice patterns, and speech content to assess a speaker’s confidence when explaining a topic. By transcribing speech, verifying correctness with GPT-4, and generating a confidence score, we offer users valuable feedback to refine their delivery. With secure login and progress tracking, we enable users to monitor their growth over time, fostering continuous improvement and mastery in their ability to articulate ideas with confidence."
    },
    {
        title: "How SPARK Works",
        content: "SPARK utilizes advanced AI models to assess communication effectiveness by analyzing " +
            " various speech and behavioral factors. We collect audio data such as voice pitch, tone, and pauses, as" +
            " well as facial expressions and behavioral signals like hand fidgeting, to evaluate a speaker’s" +
            " confidence level. Speech is transcribed using Whisper API, and its correctness is assessed with GPT" +
            " API. Our technology stack includes Librosa for detailed audio analysis (e.g., pitch, rate of speech," +
            " stuttering)," + " Whisper API for converting speech to text, and OpenCV for tracking facial expressions and behavioral" +
            " cues. These data points are processed in real-time, using machine learning models to evaluate both" +
            " the delivery (e.g., tone, emotional cues) and accuracy of speech content. SPARK offers feedback on both confidence and correctness, while tracking user progress over time."
    },
    {
        title: "Track Your Progress",
        content: "With SPARK, you can track your progress over time. Our platform provides insights into your improvement, helping you see how your speech evolves as you practice. With our secure login system, you can always come back and measure your confidence in real-time."
    }
];

const LandingPage: React.FC = () => {
    const { loginWithRedirect } = useAuth0();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slideIn, setSlideIn] = useState(true);
    const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");

    // Auto-scrolling functionality
    useEffect(() => {
        const intervalId = setInterval(() => {
            setSlideDirection("left");
            setSlideIn(false);

            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
                setSlideIn(true);
            }, 400);
        }, 15000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                bgcolor: "#121829",
            }}
        >
            <Container maxWidth="xl" sx={{ height: "100%" }}>
                <Grid container sx={{ height: "100%" }} alignItems="center">
                    {/* Left Side */}
                    <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
                        {/* Rounded Box Around Title & Tagline */}
                        <Box
                           sx={{
                            display: "inline-block",
                            px: 4,
                            py: 2,
                            bgcolor: "#17395f", // Approximate to rgba(255, 255, 255, 0.1) for a subtle dark effect
                            borderRadius: "20px", // Rounded corners
                            backdropFilter: "blur(10px)", // Subtle blur effect
                            border: "2px solid #333333", // Approximate to rgba(255, 255, 255, 0.2) for a light border
                            textAlign: "center",
                        }}
                        
                        >
                            <Typography variant="h2" fontWeight="bold" color="primary" sx={{ fontFamily: "Segoe UI Symbol" }}>
                                SPARK
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontFamily: "Segoe UI Symbol", color: "white", mt: 1 }}>
                                Know what you know, master what you don't
                            </Typography>
                        </Box>

                        {/* Login Button */}
                        <Button
                            variant="contained"
                            size="large"
                            color="primary"
                            fullWidth
                            sx={{ mt: 4, mb: 2, maxWidth: "400px", fontSize: 15, fontFamily: "Segoe UI Symbol", fontWeight: "medium" }}
                            onClick={() => loginWithRedirect()}
                        >
                            Login
                        </Button>

                        {/* Sign-Up Button */}
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            sx={{ backgroundColor: "#7e3ac9", maxWidth: "400px", fontFamily: "Segoe UI Symbol", fontSize: 15, fontWeight: "medium" }}
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
                        p: 3,
                    }}>
                        <Paper
                            elevation={3}
                            sx={{
                                width: "115%",
                                maxWidth: "1300px",
                                height: "95%",
                                p: 3,
                                bgcolor: "#262C44",
                                color: "white",
                                textAlign: "center",
                                border: "2px solid #1c1c1c",
                                position: "relative",
                                overflow: "auto",
                            }}
                        >
                            <Slide direction={slideDirection} in={slideIn} timeout={500}>
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        padding: "20px",
                                        boxSizing: "border-box",
                                    }}
                                >
                                    <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ fontFamily: "Segoe UI Symbol", color: "white" }}>
                                        {slides[currentIndex].title}
                                    </Typography>
                                    <Typography variant="body1" paragraph sx={{ fontFamily: "Segoe UI Symbol", color: "white" }}>
                                        {slides[currentIndex].content}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        fontWeight="medium"
                                        sx={{
                                            position: "absolute",
                                            bottom: "25px",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            fontFamily: "Segoe UI Symbol",
                                            fontSize: 18,
                                            cursor: 'pointer',
                                            color: '#3874cb',
                                            textDecoration: 'underline',
                                        }}
                                        onClick={() =>
                                            loginWithRedirect({
                                                authorizationParams: { screen_hint: "signup" },
                                            })
                                        }
                                    >
                                        Sign up to learn more!
                                    </Typography>

                                    {/* Circular Navigation Buttons */}
                                    <Box sx={{
                                        mt: 2,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        position: "absolute",
                                        bottom: 16,
                                        left: 16,
                                        right: 16,
                                    }}>
                                        <Button
                                            onClick={() => setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length)}
                                            variant="contained"
                                            sx={{ width: 50, height: 50, borderRadius: "50%", minWidth: "auto" }}
                                        >
                                            {"<"}
                                        </Button>
                                        <Button
                                            onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)}
                                            variant="contained"
                                            sx={{ width: 50, height: 50, borderRadius: "50%", minWidth: "auto" }}
                                        >
                                            {">"}
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
