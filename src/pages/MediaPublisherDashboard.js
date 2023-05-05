import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import VideoUpload from '../components/VideoUpload';
import axios from 'axios';
import RequestContext from './RequestContext';

const MediaPublisherDashboard = () => {
  const history = useHistory();
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchUploadedVideos();
  }, []);

  const fetchUploadedVideos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/uploads');
      setUploadedVideos(response.data);
    } catch (error) {
      console.error('Error fetching uploaded videos:', error);
    }
  };

  const handleVideoUpload = async (video) => {
    await fetchUploadedVideos();
  };

  const handleRequestFormClick = () => {
    history.push({
      pathname: '/request-form',
      state: { uploadedVideos: uploadedVideos },
    });
  };

  return (
    <RequestContext.Provider value={{ requests, setRequests }}>
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
                <a
                  href={`http://localhost:5000/uploads/${video}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {video}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </RequestContext.Provider>
  );
};

export default MediaPublisherDashboard;
