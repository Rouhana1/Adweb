import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const RequestForm = () => {
  const history = useHistory();
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

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

  const handleVideoChange = (event) => {
    setSelectedVideo(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedVideo && selectedDate) {
      try {
        await axios.post('http://localhost:5000/requests', {
          video: selectedVideo,
          date: selectedDate,
        });
        alert('Request submitted');
      } catch (error) {
        console.error('Error submitting request:', error);
      }
    }
  };

  const handleBackClick = () => {
    history.push('/mediapublisher-dashboard');
  };

  return (
    <div className="container">
      <h1>Request Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="video">Select Video:</label>
          <select id="video" value={selectedVideo} onChange={handleVideoChange}>
            <option value="">Select a video</option>
            {uploadedVideos.map((video, index) => (
              <option key={index} value={video}>
                {video}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date">Select Date:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            
            onChange={handleDateChange}
            />
          </div>
          <button type="submit">Submit Request</button>
        </form>
        <button onClick={handleBackClick}>Back</button>
      </div>
    );
  };
  
  export default RequestForm;
  