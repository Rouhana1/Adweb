import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StationDashboard.css';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const StationDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState({});
  const [timeOption, setTimeOption] = useState('');
  const [pricePerAd, setPricePerAd] = useState('');
  const [message, setMessage] = useState('');
  const [timeOptions, setTimeOptions] = useState([]);
  const [deniedRequests, setDeniedRequests] = useState([]);


  useEffect(() => {
    fetchRequests();
    fetchTimeOptions();

  }, []);

  const fetchTimeOptions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/time-slots');
      setTimeOptions(response.data);
    } catch (error) {
      console.error('Error fetching time options:', error);
    }
  };
  const deleteTimeOption = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/time-slots/${id}`);
      fetchTimeOptions();
    } catch (error) {
      console.error('Error deleting time option:', error);
    }
  };
  
  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/requests');
      setRequests(response.data.filter((request) => !request.accepted && !request.denied));
      setAcceptedRequests(response.data.filter((request) => request.accepted));
      setDeniedRequests(response.data.filter((request) => request.denied));
      setCalendarEvents(
        response.data
          .filter((request) => request.accepted)
          .map((request) => ({
            title: request.video,
            start: new Date(request.date + 'T' + request.time),
            end: new Date(request.date + 'T' + request.time),
          }))
      );
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };
  
  const acceptRequest = async (id) => {
    try {
      await axios.put(`http://localhost:5000/requests/${id}`, {
        ...requests.find((request) => request._id === id),
        accepted: true,
        time: selectedTimes[id],
      });
      fetchRequests();
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const denyRequest = async (id) => {
    try {
      await axios.put(`http://localhost:5000/requests/deny/${id}`, {
        ...acceptedRequests.find((request) => request._id === id),
        accepted: false,
        denied: true,
      });
      fetchRequests();
    } catch (error) {
      console.error('Error denying request:', error);
    }
};

const deleteDeniedRequest = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/requests/denied/${id}`);
    fetchRequests();
  } catch (error) {
    console.error('Error deleting denied request:', error);
  }
};

  
  

  const handleTimeChange = (id, time) => {
    setSelectedTimes({ ...selectedTimes, [id]: time });
  };

    const handleTimeOptionChange = (event) => {
    setTimeOption(event.target.value);
  };

  const handlePricePerAdChange = (event) => {
    setPricePerAd(event.target.value);
  };

  const addTimeOption = async (event) => {
    event.preventDefault();
    if (timeOption && pricePerAd) {
      try {
        await axios.post('http://localhost:5000/time-slots', {
          timeOption,
          pricePerAd
        });
        setTimeOption('');
        setPricePerAd('');
        setMessage({ type: 'success', text: 'Time option added.' });
        fetchTimeOptions();

      } catch (error) {
        console.error('Error adding time option:', error);
      }
    } else {
      setMessage({ type: 'error', text: 'Please fill out all fields.' });
    }
  };

  return (
    <div>
      <h1>Station Dashboard</h1>
      <div>
        <h2>Requests</h2>
        <ul>
          {requests.map((request) => (
            <li key={request._id} className="request-box">
              <a href={`/uploads/${request.video}`} download>
                {request.video}
              </a>
              {' - '}
              <strong>Stream Date: </strong>
              {request.date}
              {' - '}
              <strong>Requested Time: </strong>
              {request.peakTime}
              <input
                type="time"
                onChange={(event) =>
                  handleTimeChange(request._id, event.target.value)
                }
              />
              {selectedTimes[request._id] && (
                <button
                  onClick={() => acceptRequest(request._id)}
                >
                  Submit
                </button>
              )}
              <button
  className="deny-button"
  onClick={() => denyRequest(request._id)}
>
  Deny
</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Accepted Requests</h2>
        <ul>
          {acceptedRequests.map((request) => (
            <li key={request._id} className="accepted-request_box">
            <a href={`/uploads/${request.video}`} download>
              {request.video}
            </a>
            {' - '}
            <strong>Stream Date: </strong>
            {request.date}
            {' - '}
            <strong>Time: </strong>
            {request.time}
            <button
              className="delete-button"
              onClick={() => denyRequest(request._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
    <div>
  <h2>Denied Requests</h2>
  <ul>
    {deniedRequests.map((request) => (
      <li key={request._id} className="denied-request-box">
        <a href={`/uploads/${request.video}`} download>
          {request.video}
        </a>
        {' - '}
        <strong>Stream Date: </strong>
        {request.date}
        {' - '}
        <strong>Requested Time: </strong>
        {request.peakTime}
        <button
          className="delete-button"
          onClick={() => deleteDeniedRequest(request._id)}
        >
          Delete
        </button>
      </li>
    ))}
  </ul>
</div>
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, width: "100%" }}
      />
    </div>
    <div>
        <h2>Add Time Option</h2>
        <form onSubmit={addTimeOption}>
  <label htmlFor="timeOption">Time Option:</label>
  <input type="text" id="timeOption" value={timeOption} onChange={handleTimeOptionChange} />
  <label htmlFor="pricePerAd">Price per Advertisement:</label>
  <input type="number" id="pricePerAd" value={pricePerAd} onChange={handlePricePerAdChange} />
  <button type="submit">Add</button>
</form>
        {message && <p className={message.type}>{message.text}</p>}
        <div style={{marginLeft: '20px'}}>
    <h3>Current Time Options</h3>
    <ul>
      {timeOptions.map((timeOption) => (
        <li key={timeOption._id}>
          <p>{timeOption.timeOption} - ${timeOption.pricePerAd}</p>
          <button onClick={() => deleteTimeOption(timeOption._id)}>Delete</button>
        </li>
      ))}
    </ul>
  </div>
      </div>
  </div>
);
};

export default StationDashboard;

