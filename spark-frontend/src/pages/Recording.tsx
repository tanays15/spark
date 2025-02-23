import { th } from 'framer-motion/client';
import React, { Component } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import { Box } from "@mui/system";

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
    dropdownTopics:[],
    isDropdownActive: false,
  };

  videoRef: React.RefObject<HTMLVideoElement> = React.createRef();

  async componentDidMount() {
    try {
      const response = await fetch('http://localhost:5000/topics', {
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
      formData.append('topic', selectedTopic); // Append selected topic to form data


      const response = await fetch('http://localhost:5000/records', {
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

  handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      selectedTopic: event.target.value,
      isDropdownActive: false, // Make sure dropdown is disabled when typing
    });
  };

  handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      selectedTopic: event.target.value,
      isDropdownActive: true, // Track dropdown selection
    });
  };

  render() {
    const { isRecording, videoUrl, selectedFile, mediaStream, selectedTopic, dropdownTopics, isDropdownActive } = this.state;
  
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '20px',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ height: 'calc(100vh - 75px)', width: '100vw', fontFamily: "Helvetica Neue" }}>
  
          <h1>Record a Video</h1>
  
          {/* Camera Feed (Visible Only While Recording) */}
          {isRecording && mediaStream && (
            <div
              style={{
                width: '80%',
                maxWidth: '500px',
                margin: '0 auto',
                display: 'inline-block',
                padding: '10px',
                borderRadius: '8px',
              }}
            >
              <video
                ref={this.videoRef}
                autoPlay
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'black',
                  borderRadius: '8px',
                }}
              />
            </div>
          )}
  
          {/* Video Recording Section */}
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
  
                    setTimeout(() => {
                      if (this.videoRef.current) {
                        this.videoRef.current.play().catch(error => console.error("Video play error:", error));
                      }
                    }, 100);
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
                onChange={this.handleFileUpload}
                style={{
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '5px',
                  display: 'block',
                  margin: '0 auto',
                  marginLeft: '95px',
                }}
              />
            </div>
          </div>
  
          {/* Video Preview (For Both Recorded and Uploaded Videos) */}
          {videoUrl && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <h3>Preview</h3>
              <video controls src={videoUrl} style={{ width: '80%', maxWidth: '500px' }} />
  
              {/* Buttons Container: Keep "Record Again" and "Analyze" on the Same Line */}
              <div
                style={{
                  marginTop: '20px',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '10px', // Space between buttons
                }}
              >
                {/* Record Again Button */}
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
  
                {/* Send to Backend Button */}
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
              </div>
            </div>
          )}
  
          {/* Topic Input (Dropdown or Text Input) */}
          {videoUrl && (
            <div style={{ marginTop: '20px' }}>
              <h3>Enter the Topic You Spoke About:</h3>
  
              {/* Dropdown for topic selection */}
              {dropdownTopics.length > 0 && (
                <select
                  value={selectedTopic}
                  onChange={this.handleDropdownChange}
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
  
              {/* Text input for custom topic if no dropdown is active */}
              {(
                <input
                  type="text"
                  value={selectedTopic}
                  onChange={this.handleTopicChange}
                  placeholder="e.g., Technology, Health, Education"
                  style={{
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    width: '80%',
                    maxWidth: '400px',
                  }}
                />
              )}
            </div>
          )}
        </Box>
      </div>
    );
  }  
}

export default VideoRecorder;

