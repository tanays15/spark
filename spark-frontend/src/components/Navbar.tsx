import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, ThemeProvider, CssBaseline } from "@mui/material";
import { Link } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import theme from "../theme"; // Import your theme file
import Logo from "../assets/react.svg"; // Replace with your actual logo path

const Navbar: React.FC = () => {
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
                    borderBottom: "1px solid #ddd", // Light border like Apple
                }}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: "50px" }}>
                    {/* Logo */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img src={Logo} alt="Logo" style={{ height: "30px", marginRight: "10px" }} />
                    </Box>

                    {/* Centered Nav Links */}
                    <Box sx={{ display: "flex", gap: 4 }}>
                        <Button color="inherit" component={Link} to="/record">
                            Record
                        </Button>
                        <Button color="inherit" component={Link} to="/">
                            Analytics
                        </Button>
                        <Button color="inherit" component={Link} to="/recommendations">
                            Recommendations
                        </Button>
                        <Button color="inherit" component={Link} to="/logout">
                            Logout
                        </Button>
                    </Box>

                    {/* Icons on the Right */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <IconButton color="inherit" component={Link} to="/logout">
                            <LogoutIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
};

export default Navbar;
