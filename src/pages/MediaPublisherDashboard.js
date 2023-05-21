import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import VideoUpload from '../components/VideoUpload';
import axios from 'axios';
import RequestContext from './RequestContext';

const MediaPublisherDashboard = () => {
  const history = useHistory();
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [requests, setRequests] = useState([]);
  const [conversionMessage, setConversionMessage] = useState('');
  const [isLoading, setIsLoading] = useState({}); // initialize as an empty object

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

  const convertVideo = async (videoName) => {
    try {
      // Set isLoading to true to show the loading bar
      setIsLoading({ ...isLoading, [videoName]: true }); // set isLoading for the specific video

  
      const response = await axios.post('http://localhost:5000/convert-video', {
        videoName: videoName,
      });
  
      if (response.data.success) {
        setConversionMessage(`Video ${videoName} converted successfully`);
        handleVideoUpload()
        fetchUploadedVideos()
        
        // Wait for 30 seconds before fetching uploaded videos
        setTimeout(async () => {
          await fetchUploadedVideos();
        }, 1000);
      } else {
        setConversionMessage('Error converting video');
      }
    } catch (error) {
      console.error('Error converting video:', error);
      setConversionMessage('Error converting video');
    } finally {
      // Set isLoading back to false to hide the loading bar
      setIsLoading({ ...isLoading, [videoName]: false });
    }
  };
  

  const deleteVideo = async (videoName) => {
    try {
      const response = await axios.post('http://localhost:5000/api/delete-video', {
  videoName: videoName,
});
      if (response.data.success) {
        await fetchUploadedVideos();
      } else {
        console.log('Error deleting video');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
    }
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
          {uploadedVideos.map((video, index) => (
            <div key={index} style={{ border: '1px solid black', padding: '10px', margin: '5px' }}>
              <a
                href={`http://localhost:5000/uploads/${video}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {video}
              </a>
              <button onClick={() => convertVideo(video)} style={{ marginLeft: '10px' }} >
                {isLoading[video] ? 'Converting...' : 'Convert'}
              </button>
              <button onClick={() => deleteVideo(video)} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>Delete</button>
            </div>
          ))}
        </div>
        <div>
         
          {conversionMessage && <span style={{ marginLeft: '10px', color: 'green' }}>{conversionMessage}</span>}
        </div>
      </div>
    </RequestContext.Provider>
  );
};

export default MediaPublisherDashboard;