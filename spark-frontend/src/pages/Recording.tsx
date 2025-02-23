import React, { useState, useRef, useEffect } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import { Box, Typography } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const VideoRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);
    const [mediaStream, setMediaStream] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [countdown, setCountdown] = useState(null);
    const videoRef = useRef(null);
    const { user } = useAuth0();

    const startCountdown = (startRecording) => {
        setCountdown(3);
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(interval);
                    setCountdown(null);
                    startRecording();
                }
                return prev - 1;
            });
        }, 1000);
    };

    const sendVideoToBackend = async (videoBlob, user) => {
        try {
            const formData = new FormData();
            formData.append('file', videoBlob, 'video-file.webm');
            formData.append('user', user?.sub || 'unknown');
            formData.append('topic', selectedTopic);

            const response = await fetch('http://localhost:5000/records', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (!response.ok) console.error('Error uploading video:', result);
        } catch (error) {
            console.error('Error uploading video:', error);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0];
        if (file) setSelectedFile(file);
    };

    const handleSendUploadedFile = async () => {
        if (selectedFile) {
            const videoBlob = new Blob([await selectedFile.arrayBuffer()], { type: selectedFile.type });

            sendVideoToBackend(videoBlob, user);
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#1b2034', minHeight: '100vh' }}>
            <Navbar />
            <Box display="flex" flexDirection="column" alignItems="center" sx={{ marginTop: '40px' }}>
                <Typography variant="h2" sx={{ color: 'white' }}>Record a Video</Typography>
                {countdown !== null && <Typography variant="h1" sx={{ color: 'white' }}>{countdown}</Typography>}

                <ReactMediaRecorder
                    video
                    videoConstraints={{ mimeType: 'video/webm' }}
                    onStart={async () => {
                        setIsRecording(true);
                        try {
                            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                            setMediaStream(stream);
                            if (videoRef.current) {
                                videoRef.current.srcObject = stream;
                                videoRef.current.play();
                            }
                        } catch (error) {
                            console.error('Error accessing media devices:', error);
                        }
                    }}
                    onStop={async (blobUrl) => {
                        setIsRecording(false);
                        setVideoUrl(blobUrl);
                        if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());
                    }}
                    render={({ startRecording, stopRecording }) => (
                        <div>
                            {!isRecording && !videoUrl && (
                                <button onClick={() => startCountdown(startRecording)}>Start Recording</button>
                            )}
                            {isRecording && <button onClick={stopRecording}>Stop Recording</button>}
                        </div>
                    )}
                />

                {videoUrl && (
                    <div>
                        <Typography variant="h5" sx={{ color: 'white' }}>Preview</Typography>
                        <video controls src={videoUrl} style={{ width: '80%', maxWidth: '500px' }} />
                        <div>
                            <button onClick={() => setVideoUrl(null)}>Record Again</button>
                            <Link to="/results">
                                <button onClick={async () => {
                                    if (!selectedFile) {
                                        const response = await fetch(videoUrl);
                                        const videoBlob = await response.blob();
                                        sendVideoToBackend(videoBlob, user);
                                    } else {
                                        handleSendUploadedFile();
                                    }
                                }}>Analyze</button>
                            </Link>
                        </div>
                    </div>
                )}

                <div>
                    <Typography variant="h5" sx={{ color: 'white' }}>Or Upload a Video</Typography>
                    <input type="file" accept="video/*" onChange={handleFileUpload} />
                </div>

                <div>
                    <Typography variant="h5" sx={{ color: 'white' }}>Enter Topic</Typography>
                    <input 
                        type="text" 
                        value={selectedTopic} 
                        onChange={(e) => setSelectedTopic(e.target.value)} 
                        placeholder="Enter topic" 
                        style={{ padding: '10px', fontSize: '16px', marginTop: '10px' }}
                    />
                </div>
            </Box>
        </div>
    );
};

export default VideoRecorder;