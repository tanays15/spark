import React from "react";
import { AppBar, Toolbar, Button, Box, IconButton, ThemeProvider, CssBaseline } from "@mui/material";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate hook
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth0 } from "@auth0/auth0-react"; // Import the Auth0 hook
import theme from "../theme"; // Import your theme file
import Logo from "../assets/react.svg"; // Replace with your actual logo path

const Navbar: React.FC = () => {
    const { logout } = useAuth0(); // Destructure the logout function from Auth0
    const navigate = useNavigate(); // Initialize useNavigate hook for programmatic navigation

    const handleLogout = () => {
        logout({ returnTo: window.location.origin }); // Logs the user out
        navigate("/"); // Navigate to the landing page after logout
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Resets global styles for Material UI */}

            <AppBar
                position="fixed"
                color="default"
                elevation={0} // Removes shadow
                sx={{
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "50px", // Smaller height
                    display: "flex",
                    justifyContent: "center",
                    bgcolor: "#404560",
                }}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: "50px" }}>
                    {/* Logo */}
                    <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center" }}>
                        <img src={Logo} alt="Logo" style={{ height: "30px", marginRight: "10px" }} />
                    </Box>

                    {/* Centered Nav Links */}
                    <Box sx={{ display: "flex", gap: 4 }}>
                        <Button color="inherit" component={Link} to="/record" sx={{ color: "black" }}>
                            New Recording
                        </Button>
                        <Button color="inherit" component={Link} to="/profile" sx={{ color: "black" }}>
                            Dashboard
                        </Button>
                        <Button color="inherit" onClick={handleLogout} sx={{ color: "black" }}>
                            Logout
                        </Button>
                    </Box>

                    {/* Icons on the Right */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <IconButton color="inherit" onClick={handleLogout}>
                            <LogoutIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
};

export default Navbar;