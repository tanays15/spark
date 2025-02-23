import React, { useState, useRef } from 'react';
import { Box, Button, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ReactMediaRecorder } from 'react-media-recorder';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from '../components/Navbar';

const Recording = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [dropdownTopics, setDropdownTopics] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setSelectedFile(file);
      const videoUrl = URL.createObjectURL(file);
      setVideoUrl(videoUrl);
    }
  };

  const handleDropdownChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedTopic(event.target.value as string);
  };

  const handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTopic(event.target.value);
  };

  const handleSendUploadedFile = async () => {
    if (!selectedFile) return;
    try {
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('userId', user?.sub || 'anonymous');
      formData.append('topic', selectedTopic);

      const response = await fetch('http://localhost:5000/records', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('File uploaded successfully!');
      } else {
        console.error('File upload failed');
      }
    } catch (error) {
      console.error('Error sending uploaded file:', error);
    }
  };

  const sendVideoToBackend = async (videoBlob: Blob, user: any) => {
    try {
      const formData = new FormData();
      formData.append('video', videoBlob);
      formData.append('userId', user?.sub || 'anonymous');
      formData.append('topic', selectedTopic);

      const response = await fetch('http://localhost:5000/records', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Video sent for analysis');
      } else {
        console.error('Video analysis request failed');
      }
    } catch (error) {
      console.error('Error sending video:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          height: 'calc(100vh - 75px)',
          width: '100vw',
          fontFamily: 'Helvetica Neue',
          overflow: 'auto',
          padding: '20px',
          backgroundColor: '#1b2034',
          color: 'white',
          margin: '0 auto',
        }}
      >
        {!isAuthenticated ? (
          <Button
            onClick={() => loginWithRedirect()}
            variant="contained"
            sx={{ backgroundColor: '#3874cb', marginBottom: '20px' }}
          >
            Log in
          </Button>
        ) : (
          <>
            <Typography variant="h5" sx={{ color: 'white', marginBottom: '20px' }}>
              Welcome, {user?.name}
            </Typography>
          </>
        )}

        {/* Live Camera Feed */}
        {isRecording && (
          <Box sx={{ marginBottom: '20px', textAlign: 'center' }}>
            <video
              ref={videoRef}
              autoPlay
              muted
              style={{ width: '80%', maxWidth: '500px', borderRadius: '10px' }}
            />
          </Box>
        )}

        <ReactMediaRecorder
          video
          onStart={async () => {
            setIsRecording(true);
            try {
              const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
              });

              if (videoRef.current) {
                videoRef.current.srcObject = stream;
              }
            } catch (error) {
              console.error('Error accessing media devices:', error);
            }
          }}
          onStop={async (blobUrl: string) => {
            setIsRecording(false);
            setVideoUrl(blobUrl);

            if (videoRef.current && videoRef.current.srcObject) {
              const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
              tracks.forEach(track => track.stop());
              videoRef.current.srcObject = null; // Clear the video source
            }
          }}
          render={({ startRecording, stopRecording }) => (
            <Box display="flex" justifyContent="center" alignItems="center" gap={2} flexDirection="column">
              {!isRecording && !videoUrl && (
                <Button
                  onClick={startRecording}
                  variant="contained"
                  sx={{ backgroundColor: '#3874cb', marginBottom: '20px' }}
                >
                  Start Recording
                </Button>
              )}

              {isRecording && (
                <Button
                  onClick={stopRecording}
                  variant="contained"
                  sx={{ backgroundColor: '#370173', marginBottom: '20px' }}
                >
                  Stop Recording
                </Button>
              )}
            </Box>
          )}
        />

        {/* Video Upload Section */}
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6" align="center">
            Or Upload a Video
          </Typography>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            style={{
              padding: '10px',
              fontSize: '16px',
              borderRadius: '5px',
              display: 'block',
              margin: '0 auto',
            }}
          />
        </div>

        {/* Video Preview (For Both Recorded and Uploaded Videos) */}
        {videoUrl && (
          <Box sx={{ marginTop: '20px', textAlign: 'center' }}>
            <Typography variant="h6">Preview</Typography>
            <video controls src={videoUrl} style={{ width: '80%', maxWidth: '500px', borderRadius: '10px' }} />

            <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Button
                onClick={() => {
                  setVideoUrl(null);
                  setIsRecording(false);
                  setSelectedFile(null);
                }}
                variant="contained"
                sx={{ backgroundColor: '#3874cb' }}
              >
                {selectedFile ? 'Upload Another File' : 'Record Again'}
              </Button>

              <Button
                onClick={async () => {
                  if (!selectedFile) {
                    const response = await fetch(videoUrl);
                    const videoBlob = await response.blob();
                    if (user) {
                      sendVideoToBackend(videoBlob, user);
                    } else {
                      console.error('User not authenticated');
                    }
                  } else {
                    handleSendUploadedFile();
                  }
                }}
                variant="contained"
                sx={{ backgroundColor: '#370173' }}
              >
                Analyze
              </Button>
            </Box>
          </Box>
        )}

        {/* Topic Input (Dropdown or Text Input) */}
        {videoUrl && (
          <Box sx={{ marginTop: '20px', width: '100%', maxWidth: '400px' }}>
            <Typography variant="h6" align="center">
              Enter the Topic You Spoke About:
            </Typography>

            {dropdownTopics.length > 0 && (
              <FormControl fullWidth>
                <InputLabel>Choose a Topic</InputLabel>
                <Select value={selectedTopic} onChange={handleDropdownChange} label="Choose a Topic">
                  <MenuItem value="">Select a topic</MenuItem>
                  {dropdownTopics.map((topic, index) => (
                    <MenuItem key={index} value={topic}>
                      {topic}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <input
              type="text"
              value={selectedTopic}
              onChange={handleTopicChange}
              placeholder="e.g., Technology, Health, Education"
              style={{
                padding: '10px',
                fontSize: '16px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                width: '100%',
                marginTop: '10px',
              }}
            />
          </Box>
        )}
      </Box>
    </div>
  );
};

export default Recording;