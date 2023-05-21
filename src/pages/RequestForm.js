import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const RequestForm = () => {
  const history = useHistory();
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [peakTime, setPeakTime] = useState('');
  const [timeOptions, setTimeOptions] = useState([]);



  useEffect(() => {
    fetchUploadedVideos();
    fetchTimeOptions();  // fetch time options on component mount

  }, []);

  const fetchTimeOptions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/time-slots');
      setTimeOptions(response.data);
    } catch (error) {
      console.error('Error fetching time options:', error);
    }
  };
  const fetchUploadedVideos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/uploads');
      setUploadedVideos(response.data);
    } catch (error) {
      console.error('Error fetching uploaded videos:', error);
    }
  };

  const handlePeakTimeChange = (event) => {
    setPeakTime(event.target.value);
  };
  const handleVideoChange = (event) => {
    setSelectedVideo(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedVideo && selectedDate && peakTime) {
      try {
        await axios.post('http://localhost:5000/requests', {
          video: selectedVideo,
          date: selectedDate,
          peakTime: peakTime,
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
          <div>
          <label htmlFor="peakTime">Select Peak Time:</label>
          <select id="peakTime" value={peakTime} onChange={handlePeakTimeChange}>
  <option value="">Select a time</option>
  {timeOptions.map((option, index) => (
    <option key={index} value={option.timeOption}>
      {`${option.timeOption} - ${option.pricePerAd}$`}
    </option>
  ))}
</select>
        </div>
          <button type="submit">Submit Request</button>

        </form>
        <button onClick={handleBackClick}>Back</button>
      </div>
    );
  };
  
  export default RequestForm;