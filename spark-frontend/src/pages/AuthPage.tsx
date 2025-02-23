import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, TextField, Container, Box, Typography } from "@mui/material";
import Navbar from "../components/Navbar"; // Import Navbar component

const LoginPage = () => {
    const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

    return (
        <div>
            <Navbar /> {/* Navbar at the top */}

            {/* Page Content - Adding margin to prevent overlap with fixed navbar */}
            <Container maxWidth="xs" sx={{ mt: 12 }}> {/* Adjust margin-top to avoid navbar overlap */}
                <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
                    <Typography variant="h4" gutterBottom>
                        {isAuthenticated ? `Welcome, ${user?.name}` : "Login"}
                    </Typography>

                    {!isAuthenticated ? (
                        <>
                            <TextField label="Email" variant="outlined" fullWidth margin="normal" />
                            <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" />
                            <Button variant="contained" color="primary" fullWidth onClick={() => loginWithRedirect()}>
                                Log In with Auth0
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                        >
                            Log Out
                        </Button>
                    )}
                </Box>
            </Container>
        </div>
    );
};

export default LoginPage;
