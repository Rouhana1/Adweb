import React, { useRef, useState } from 'react';
import axios from 'axios';
import './VideoUpload.css';

const VideoUpload = ({ onUpload }) => {
  const [video, setVideo] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideo(file);
    } else {
      alert('Please select a video file');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideo(file);
    } else {
      alert('Please drop a video file');
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!video) {
      alert('Please select a video to upload');
      return;
    }

    const formData = new FormData();
    formData.append('video', video);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData);
      alert(response.data.message);
      onUpload(video);
    } catch (error) {
      alert('Error uploading video');
    }
  };

  return (
    <div>
      <div
        className="VideoUpload"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept="video/*"
          style={{ display: 'none' }}
        />
        {video ? (
          <p>{video.name}</p>
        ) : (
          <p>Click here or drag and drop a video file</p>
        )}
      </div>
      <button onClick={handleUpload}>Submit</button>
    </div>
  );
};

export default VideoUpload;
