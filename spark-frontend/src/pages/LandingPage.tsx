/*import React from 'react';
import { Box, Button, Typography, Container, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
const LandingPage = () => {
    return (
        <Container maxWidth="lg">
            <Box
                display="flex"
                height="100vh"
                alignItems="center"
                justifyContent="center"
            >
                {Left side: Branding and login buttons}
                <Box width="50%" textAlign="center">
                    <Typography variant="h2" fontWeight="bold" color="success">
                        SPARK
                    </Typography>
                    <Typography variant="subtitle1" color="white" sx={{ mb: 4 }}>
                        Know what you know, master what you don't
                    </Typography>

                    <Link to="/auth" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" color="primary" size="large" sx={{ mb: 2, width: '80%' }}>
                            Login
                        </Button>
                    </Link>

                    <Link to="/auth" style={{ textDecoration: 'none' }}>
                        <Button variant="outlined" color="secondary" size="large" sx={{ width: '80%' }}>
                            Sign Up
                        </Button>
                    </Link>
                </Box>

                {Right side: Demo preview section}
                <Box width="50%" display="flex" justifyContent="center">
                    <Paper
                        elevation={3}
                        sx={{
                            width: '90%',
                            height: '60vh',
                            overflowY: 'auto',
                            p: 2,
                            bgcolor: '#f9f9f9',
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold">
                            What is SPARK?
                        </Typography>
                        <Typography variant="body1" paragraph>
                            SPARK helps you improve speaking confidence by analyzing voice patterns, speech rate, and fluency.
                        </Typography>
                        <Typography variant="body1">
                            Scroll to learn more about how it works...
                        </Typography>
                    </Paper>
                </Box>
            </Box>
        </Container>
    );
}; */

//export default LandingPage;

import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Image from "next/image";
import ButtonPrimary from "../components/ButtonPrimary.tsx";
import getScrollAnimation from "../utils/getScrollAnimation.ts";
import ScrollAnimationWrapper from "../components/ScrollAnimationWrapper.tsx";

const LandingPage = () => {
    const scrollAnimation = useMemo(() => getScrollAnimation(), []);

    return (
        <div className="max-w-screen-xl mt-24 px-8 xl:px-16 mx-auto bg-black text-white" id="landing">
            <ScrollAnimationWrapper>
                <motion.div
                    className="grid grid-flow-row sm:grid-flow-col grid-rows-2 md:grid-rows-1 sm:grid-cols-2 gap-8 py-6 sm:py-16"
                    variants={scrollAnimation}
                >
                    {/* Left Section - Branding and Login */}
                    <div className="flex flex-col justify-center items-start row-start-2 sm:row-start-1">
                        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-medium leading-normal">
                            Unleash Your Potential with <strong>SPARK</strong>.
                        </h1>
                        <p className="mt-4 mb-6">Know what you know, master what you don’t</p>

                        <Link to="/auth" style={{ textDecoration: "none" }}>
                            <ButtonPrimary>Login</ButtonPrimary>
                        </Link>

                        <Link to="/auth" style={{ textDecoration: "none" }}>
                            <ButtonPrimary variant="outlined" className="mt-4">Sign Up</ButtonPrimary>
                        </Link>
                    </div>

                    {/* Right Section - Illustration */}
                    <div className="flex w-full">
                        <motion.div className="h-full w-full" variants={scrollAnimation}>
                            <Image
                                src="/assets/Illustration1.png"
                                alt="Illustration"
                                quality={100}
                                width={612}
                                height={383}
                                layout="responsive"
                            />
                        </motion.div>
                    </div>
                </motion.div>
            </ScrollAnimationWrapper>

            {/* Stats Section */}
            <div className="relative w-full flex">
                <ScrollAnimationWrapper className="rounded-lg w-full grid grid-flow-row sm:grid-flow-row grid-cols-1 sm:grid-cols-3 py-9 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-gray-100 bg-white z-10">
                    {[
                        { name: "Users", number: "390", icon: "/assets/Icon/heroicons_sm-user.svg" },
                        { name: "Locations", number: "20", icon: "/assets/Icon/gridicons_location.svg" },
                        { name: "Server", number: "50", icon: "/assets/Icon/bx_bxs-server.svg" },
                    ].map((item, index) => (
                        <motion.div
                            className="flex items-center justify-start sm:justify-center py-4 sm:py-6 w-8/12 px-4 sm:w-auto mx-auto sm:mx-0"
                            key={index}
                            custom={{ duration: 2 + index }}
                            variants={scrollAnimation}
                        >
                            <div className="flex mx-auto w-40 sm:w-auto">
                                <div className="flex items-center justify-center bg-orange-100 w-12 h-12 mr-6 rounded-full">
                                    <img src={item.icon} className="h-6 w-6" alt={`${item.name} icon`} />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-xl font-bold">{item.number}+</p>
                                    <p className="text-lg">{item.name}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </ScrollAnimationWrapper>
                <div
                    className="absolute bg-black opacity-5 w-11/12 rounded-lg h-64 sm:h-48 top-0 mt-8 mx-auto left-0 right-0"
                    style={{ filter: "blur(114px)" }}
                ></div>
            </div>
        </div>
    );
};

export default LandingPage;
