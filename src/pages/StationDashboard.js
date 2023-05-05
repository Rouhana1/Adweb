import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StationDashboard.css';

const StationDashboard = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
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

  return (
    <div>
      <h1>Station Dashboard</h1>
      <div>
        <h2>Requests</h2>
        <ul>
          {requests.map((request) => (
            <li key={request.id} className="request-box">
              <a href={`/uploads/${request.video}`} download>
                {request.video}
              </a>
              {' - '}
              {request.date}
              <button
                className="delete-button"
                onClick={() => deleteRequest(request.id)}
              >
                x
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StationDashboard;
