import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../components/Navbar.tsx";

const AnalyticsPage: React.FC = () => {
    const { topic } = useParams<{ topic: string }>();
    const [records, setRecords] = useState<{ timestamp: string; score: number }[]>([]);
    const { handleRedirectCallback, isAuthenticated, user, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/records?username=${user?.name}&topic=${topic}`);
                const data = await response.json();
                setRecords(data);
            } catch (error) {
                console.error("Error fetching records:", error);
            }
        };
        fetchData();
    }, [user?.name, topic]);

    return (
        <Box sx={{ width: "100vw", height: "100vh", p: 3 }}>
            {/* Add Navbar here */}
            <Navbar />

            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, textAlign: "center" }}>
                Analytics for {topic}
            </Typography>
            <Grid container spacing={2}>
                {/* Left Side - Records Table */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                            Records Table
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Timestamp</TableCell>
                                        <TableCell>Score</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {records.map((record, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{record.timestamp}</TableCell>
                                            <TableCell>{record.score}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* Right Side - Line Graph */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                            Your Progress Over Time
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={records}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis domain={['auto', 'auto']} />
                                <Tooltip />
                                <Line type="monotone" dataKey="score" stroke="#3874cb" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AnalyticsPage;