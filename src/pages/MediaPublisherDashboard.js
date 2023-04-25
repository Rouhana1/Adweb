import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import VideoUpload from '../components/VideoUpload';

const MediaPublisherDashboard = () => {
  const history = useHistory();
  const [uploadedVideos, setUploadedVideos] = useState([]);

  const handleVideoUpload = (video) => {
    setUploadedVideos([...uploadedVideos, video]);
  };

  const handleRequestFormClick = () => {
    history.push('/request-form');
  };

  return (
    <div>
      <h1>Media Publisher Dashboard</h1>
      <button
        onClick={handleRequestFormClick}
        style={{ backgroundColor: 'green', color: 'white' }}
      >
        Submit a Request
      </button>
      <VideoUpload onUpload={handleVideoUpload} />
      <div>
        <h2>Uploads</h2>
        <ul>
          {uploadedVideos.map((video, index) => (
            <li key={index}>
              <a href={URL.createObjectURL(video)} target="_blank" rel="noopener noreferrer">
                {video.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MediaPublisherDashboard;
