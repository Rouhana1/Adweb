import React, { useState } from 'react';

const RequestForm = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleVideoChange = (event) => {
    setSelectedVideo(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // For now, the submit button does nothing.
    // You can add the logic to send the request later.
  };

  return (
    <div>
      <h1>Request Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="video">Select Video:</label>
          <select id="video" value={selectedVideo} onChange={handleVideoChange}>
            {/* Here you will need to populate the options with the videos from the dashboard */}
            {/* Example: <option value="video1.mp4">Video 1</option> */}
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
    </div>
  );
};

export default RequestForm;
