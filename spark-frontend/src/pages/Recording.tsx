import { th } from 'framer-motion/client';
import React, { Component } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import { Box } from "@mui/system";
import Navbar from '../components/Navbar';
import { Typography } from "@mui/material";
import { Link } from 'react-router-dom';
interface VideoRecorderState {
  isRecording: boolean;
  videoUrl: string | null;
  mediaStream: MediaStream | null;
  selectedFile: File | null;
  selectedTopic: string;
  dropdownTopics: string[];
  isDropdownActive: boolean;
}

class VideoRecorder extends Component<{}, VideoRecorderState> {
  state: VideoRecorderState = {
    isRecording: false,
    videoUrl: null,
    mediaStream: null,
    selectedFile: null,
    selectedTopic: '',
    dropdownTopics: [],
    isDropdownActive: false,
  };

  videoRef: React.RefObject<HTMLVideoElement> = React.createRef();

  async componentDidMount() {
    try {
      const response = await fetch('http://127.0.0.1:5000/topics', {
        method: 'GET'
      });
      const data = await response.json();
      if (response.ok) {
        this.setState({ dropdownTopics: data.topics });
      } else {
        console.error('Failed to fetch topics');
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  }

  sendVideoToBackend = async (videoBlob: Blob) => {
    const { selectedTopic } = this.state;

    try {
      const formData = new FormData();
      formData.append('file', videoBlob, 'video-file.webm');
      formData.append('topic', selectedTopic);

      const response = await fetch('http://127.0.0.1:5000/records', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Video uploaded successfully:', result);
      } else {
        console.error('Error uploading video:', result);
      }
    } catch (error) {
      console.error('Error uploading video to the server:', error);
    }
  };

  handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      this.setState({ selectedFile: file, videoUrl: URL.createObjectURL(file) });
    }
  };

  handleSendUploadedFile = async () => {
    if (this.state.selectedFile) {
      const videoBlob = new Blob([await this.state.selectedFile.arrayBuffer()], { type: this.state.selectedFile.type });
      this.sendVideoToBackend(videoBlob);
    }
  };

  render() {
    const { isRecording, videoUrl, selectedFile, mediaStream, selectedTopic, dropdownTopics, isDropdownActive } = this.state;

    return (
        <div
            style={{
              textAlign: 'center',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: "#1b2034",
              minHeight: "100vh",
            }}
        >
          <Navbar style={{ marginBottom: '20px' }} />
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ height: 'calc(100vh - 75px)', width: '100vw', fontFamily: "Helvetica Neue", overflow: 'auto', marginTop: '40px'}}>

            <Typography variant="h2" sx={{ color: "white", fontWeight: "medium", fontFamily: "Helvetica Neue", textAlign: "center" }}>
              Record a Video
            </Typography>

            {/* Camera Feed */}
            {isRecording && mediaStream && (
                <video
                    ref={this.videoRef}
                    autoPlay
                    muted
                    style={{
                      width: '80%',
                      maxWidth: '500px',
                      backgroundColor: 'black',
                      borderRadius: '8px',
                      marginTop: '20px'
                    }}
                />
            )}

            {/* Video Recorder */}
            <ReactMediaRecorder
                video
                videoConstraints={{ mimeType: 'video/webm' }}
                onStart={async () => {
                  this.setState({ isRecording: true });

                  try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    this.setState({ mediaStream: stream }, () => {
                      if (this.videoRef.current) {
                        this.videoRef.current.srcObject = stream;
                        this.videoRef.current.play().catch(error => console.error("Video play error:", error));
                      }
                    });

                  } catch (error) {
                    console.error("Error accessing media devices:", error);
                  }
                }}
                onStop={async (blobUrl: string) => {
                  this.setState({ isRecording: false, videoUrl: blobUrl });

                  if (this.state.mediaStream) {
                    this.state.mediaStream.getTracks().forEach(track => track.stop());
                  }
                }}
                render={({ startRecording, stopRecording }) => (
                    <div style={{ marginTop: "20px" }}>
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

            {/* Video Preview */}
            {videoUrl && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <h3 style={{ color: 'white' }}>Preview</h3>
                  <video controls src={videoUrl} style={{ width: '80%', maxWidth: '500px' }} />

                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button
                        onClick={() => this.setState({ videoUrl: null, isRecording: false, mediaStream: null, selectedFile: null })}
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
                      {this.state.selectedFile ? 'Upload Another File' : 'Record Again'}
                    </button>

                      <Link to="/results" style={{ textDecoration: 'none' }}>
                          <button
                              onClick={async () => {
                                  if (!this.state.selectedFile) {
                                      const response = await fetch(videoUrl);
                                      const videoBlob = await response.blob();
                                      this.sendVideoToBackend(videoBlob);
                                  } else {
                                      this.handleSendUploadedFile();
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
                      </Link>
                  </div>
                </div>
            )}

            <div style={{ marginTop: '40px', textAlign: 'center' }}>
              <h3 style={{ color: 'white' }}>Or Upload a Video</h3>
              <input
                  type="file"
                  accept="video/*"
                  onChange={this.handleFileUpload}
                  style={{
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '5px',
                    display: 'block',
                    margin: '10px auto',
                    color: 'white'
                  }}
              />
            </div>
          </Box>
        </div>
    );
  }
}

export default VideoRecorder;
