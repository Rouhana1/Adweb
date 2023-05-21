import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [publisherName, setPublisherName] = useState('');
  const [publisherUsername, setPublisherUsername] = useState('');
  const [publisherPassword, setPublisherPassword] = useState('');
  const [stationName, setStationName] = useState('');
  const [stationUsername, setStationUsername] = useState('');
  const [stationPassword, setStationPassword] = useState('');

  // Assuming you have endpoints to fetch publishers and stations
  const [publishers, setPublishers] = useState([]);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/publishers').then(res => setPublishers(res.data));
    axios.get('http://localhost:5000/stations').then(res => setStations(res.data));
  }, []);

  const addPublisher = () => {
    axios.post('http://localhost:5000/publishers', {
      name: publisherName,
      username: publisherUsername,
      password: publisherPassword,
    }).then(res => {
      setPublishers([...publishers, res.data]);
      setPublisherName('');
      setPublisherUsername('');
      setPublisherPassword('');
      axios.get('http://localhost:5000/publishers').then(res => setPublishers(res.data));
      axios.get('http://localhost:5000/stations').then(res => setStations(res.data));
    });
  };
  const deletePublisher = (id) => {
    axios.delete(`http://localhost:5000/publishers/${id}`)
      .then(() => {
        setPublishers(publishers.filter(publisher => publisher._id !== id));
      });
  };

  const deleteStation = (id) => {
    axios.delete(`http://localhost:5000/stations/${id}`)
      .then(() => {
        setStations(stations.filter(station => station._id !== id));
      });
  };


  const addStation = () => {
    axios.post('http://localhost:5000/stations', {
      name: stationName,
      username: stationUsername,
      password: stationPassword,
    }).then(res => {
      setStations([...stations, res.data]);
      setStationName('');
      setStationUsername('');
      setStationPassword('');
      axios.get('http://localhost:5000/publishers').then(res => setPublishers(res.data));
      axios.get('http://localhost:5000/stations').then(res => setStations(res.data));
    });
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Add a Publisher</h2>
      <input type="text" value={publisherName} onChange={e => setPublisherName(e.target.value)} placeholder="Publisher Name" />
      <input type="text" value={publisherUsername} onChange={e => setPublisherUsername(e.target.value)} placeholder="Publisher Username" />
      <input type="password" value={publisherPassword} onChange={e => setPublisherPassword(e.target.value)} placeholder="Publisher Password" />
      <button onClick={addPublisher}>Add</button>

      <h2>Add a Station</h2>
      <input type="text" value={stationName} onChange={e => setStationName(e.target.value)} placeholder="Station Name" />
      <input type="text" value={stationUsername} onChange={e => setStationUsername(e.target.value)} placeholder="Station Username" />
      <input type="password" value={stationPassword} onChange={e => setStationPassword(e.target.value)} placeholder="Station Password" />
      <button onClick={addStation}>Add</button>

      <h2>Publishers</h2>
      {publishers.map(publisher => (
        <div key={publisher._id}>
          <p>Name: {publisher.name}</p>
          <p>Username: {publisher.username}</p>
          <button onClick={() => deletePublisher(publisher._id)}>Delete</button>
        </div>
      ))}

      <h2>Stations</h2>
      {stations.map(station => (
        <div key={station._id}>
          <p>Name: {station.name}</p>
          <p>Username: {station.username}</p>
          <button onClick={() => deleteStation(station._id)}>Delete</button>
        </div>
      ))}

    </div>
  );
};

export default AdminDashboard;
