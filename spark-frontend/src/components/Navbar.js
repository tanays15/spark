// components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import Link from 'next/link';

const Navbar = () => (
    <AppBar position="sticky">
        <Toolbar>
            <Link href="/" passHref>
                <Button color="inherit">Home</Button>
            </Link>
            <Link href="/spark-frontend/src/old pages/dashboard" passHref>
                <Button color="inherit">Dashboard</Button>
            </Link>
            <Link href="/spark-frontend/src/old pages/profile" passHref>
                <Button color="inherit">Profile</Button>
            </Link>
        </Toolbar>
    </AppBar>
);

export default Navbar;