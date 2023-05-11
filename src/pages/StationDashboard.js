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

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/requests');
      setRequests(response.data.filter((request) => !request.accepted));
      setAcceptedRequests(response.data.filter((request) => request.accepted));
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

  const deleteRequest = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/requests/${id}`);
      fetchRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const handleTimeChange = (id, time) => {
    setSelectedTimes({ ...selectedTimes, [id]: time });
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
                onClick={() => deleteRequest(request._id)}
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
              onClick={() => deleteRequest(request._id)}
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
  </div>
);
};

export default StationDashboard;

