import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

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
        return <h1>Loading...</h1>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Your Profile
            </Typography>
            <Typography variant="body1">
                Welcome, {user?.name}!
            </Typography>
        </Box>
    );
};

export default ProfilePage;