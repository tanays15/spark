import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useAuth0 } from "@auth0/auth0-react";
import { format } from "date-fns"; // Import the format function from date-fns
import Navbar from "../components/Navbar.tsx";

const AnalyticsPage: React.FC = () => {
    const { topic } = useParams<{ topic: string }>();
    const [records, setRecords] = useState<{ timestamp: string; score: number; contentScore: number; confidenceScore: number }[]>([]);
    const { handleRedirectCallback, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const [trendMessage, setTrendMessage] = useState<string>(""); // State for analysis message

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/records?username=${user?.name}&topic=${topic}`);
                const data = await response.json();
                const formattedData = data.map((record: any, index: number) => ({
                    timestamp: format(new Date(record.created_at), "MM/yy HH:mm"),
                    score: record.score,
                    contentScore: record.contentScore, // Include contentScore
                    confidenceScore: record.confidenceScore, // Include confidenceScore
                    index: index + 1 // Numerical index for regression
                }));
                setRecords(formattedData);
                analyzeTrend(formattedData);
            } catch (error) {
                console.error("Error fetching records:", error);
            }
        };
        fetchData();
    }, [user?.name, topic]);

    // Function to analyze trend using least squares regression
    const analyzeTrend = (data: { index: number; score: number }[]) => {
        if (data.length < 2) {
            setTrendMessage("Not enough data to analyze trends.");
            return;
        }

        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        const n = data.length;

        data.forEach(({ index, score }) => {
            sumX += index;
            sumY += score;
            sumXY += index * score;
            sumX2 += index * index;
        });

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

        if (slope > 1) {
            setTrendMessage("You're improving significantly! Keep it up!");
        } else if (slope > 0) {
            setTrendMessage("You're improving gradually. Stay consistent!");
        } else if (slope < -1) {
            setTrendMessage("Your performance is dropping. Review and adjust your approach.");
        } else {
            setTrendMessage("Your performance is stable with little change.");
        }
    };

    return (
        <Box sx={{ width: "100vw", height: "100vh", p: 3, backgroundColor: "#1b2034"}}>
            <Navbar />
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, textAlign: "center", paddingTop: 5, color: "white" }}>
                {user?.name}'s Analytics for {topic}
            </Typography>
            <Grid container spacing={2}>
                {/* Left Side - Records Table */}
                <Grid item xs={12} md={6} overflow='auto'>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                            Records Table
                        </Typography>
                        <TableContainer sx={{ overflow: 'auto', maxHeight: '500px' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Timestamp</TableCell>
                                        <TableCell>Overall Score</TableCell>
                                        <TableCell>Content Score</TableCell>
                                        <TableCell>Confidence Score</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {records.map((record, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{record.timestamp}</TableCell>
                                            <TableCell>{record.score}</TableCell>
                                            <TableCell>{record.contentScore}</TableCell>
                                            <TableCell>{record.confidenceScore}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* Right Side - Line Graph and Analysis */}
                <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                            Your Progress Over Time
                        </Typography>
                        <ResponsiveContainer width="100%" height={460}>
                            <LineChart data={records}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis domain={['auto', 'auto']} />
                                <Tooltip />
                                <Line type="monotone" dataKey="score" stroke="#3874cb" strokeWidth={2} />
                                <Line type="monotone" dataKey="contentScore" stroke="#82ca9d" strokeWidth={2} />
                                <Line type="monotone" dataKey="confidenceScore" stroke="#ff7300" strokeWidth={2} />
                                <Legend
                                    layout="horizontal"
                                    align="center"
                                    verticalAlign="top"
                                    wrapperStyle={{ paddingBottom: 10 }}
                                    payload={[
                                        { value: 'Overall Score', type: 'line', color: '#3874cb' },
                                        { value: 'Content Score', type: 'line', color: '#82ca9d' },
                                        { value: 'Confidence Score', type: 'line', color: '#ff7300' }
                                    ]}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                        <Typography variant="body1" fontWeight="bold" sx={{ mt: 2, textAlign: "center" }}>
                            {trendMessage}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AnalyticsPage;
