import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { ReactMediaRecorder } from 'react-media-recorder';
import { useAuth0 } from '@auth0/auth0-react'; // Auth0 hook import

const Recording = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [dropdownTopics, setDropdownTopics] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    // Fetch available topics for the dropdown (for example, from a backend API)
    const fetchTopics = async () => {
      try {
        const response = await fetch('http://localhost:5000/topics');
        const topics = await response.json();
        setDropdownTopics(topics);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchTopics();
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setSelectedFile(file);
      const videoUrl = URL.createObjectURL(file);
      setVideoUrl(videoUrl);
    }
  };

  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTopic(event.target.value);
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
      <Box style={{ textAlign: 'center', padding: '20px' }}>
        {/* Auth0 Login / Logout */}
        {!isAuthenticated ? (
          <button
            onClick={() => loginWithRedirect()}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#3874cb',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '20px',
            }}
          >
            Log in
          </button>
        ) : (
          <>
            <p>Welcome, {user?.name}</p>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#370173',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginBottom: '20px',
              }}
            >
              Log out
            </button>
          </>
        )}

        {/* Recording Section */}
        <ReactMediaRecorder
          video
          onStart={async () => {
            setIsRecording(true);
            try {
              const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
              });

              setMediaStream(stream);
              if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setTimeout(() => {
                  if (videoRef.current) {
                    videoRef.current.play().catch((error) =>
                      console.error('Video play error:', error)
                    );
                  }
                }, 100);
              }
            } catch (error) {
              console.error('Error accessing media devices:', error);
            }
          }}
          onStop={async (blobUrl: string) => {
            setIsRecording(false);
            setVideoUrl(blobUrl);

            if (mediaStream) {
              mediaStream.getTracks().forEach((track) => track.stop());
            }
          }}
          render={({ startRecording, stopRecording }) => (
            <div>
              {!isRecording && !videoUrl && (
                <button
                  onClick={startRecording}
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#3874cb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Start Recording
                </button>
              )}

              {isRecording && (
                <button
                  onClick={stopRecording}
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#370173',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Stop Recording
                </button>
              )}
            </div>
          )}
        />

        {/* Video Upload Section */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h3>Or Upload a Video</h3>
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
        </div>

        {/* Video Preview (For Both Recorded and Uploaded Videos) */}
        {videoUrl && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <h3>Preview</h3>
            <video controls src={videoUrl} style={{ width: '80%', maxWidth: '500px' }} />

            <div
              style={{
                marginTop: '20px',
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              {/* Record Again Button */}
              <button
                onClick={() =>
                  setVideoUrl(null) &&
                  setIsRecording(false) &&
                  setMediaStream(null) &&
                  setSelectedFile(null)
                }
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: '#3874cb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                {selectedFile ? 'Upload Another File' : 'Record Again'}
              </button>

              {/* Send to Backend Button */}
              <button
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
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: '#370173',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Analyze
              </button>
            </div>
          </div>
        )}

        {/* Topic Input (Dropdown or Text Input) */}
        {videoUrl && (
          <div style={{ marginTop: '20px' }}>
            <h3>Enter the Topic You Spoke About:</h3>

            {dropdownTopics.length > 0 && (
              <select
                value={selectedTopic}
                onChange={handleDropdownChange}
                style={{
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  width: '80%',
                  maxWidth: '400px',
                }}
              >
                <option value="">Select a topic</option>
                {dropdownTopics.map((topic, index) => (
                  <option key={index} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
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
                width: '80%',
                maxWidth: '400px',
                marginTop: '10px',
              }}
            />
          </div>
        )}
      </Box>
    </div>
  );
};

export default Recording;