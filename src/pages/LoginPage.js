
 

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const LoginPage = () => {
  const history = useHistory();
  const [showPublisherLoginForm, setShowPublisherLoginForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePublisherLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', {
        username: username,
        password: password
      });

      if (response.data.success) {
        history.push('/publisher-dashboard');
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage('Incorrect username or password. Please try again.');
      console.error(error);
    }
  };
  const handleStationLogin = () => {
    history.push('/station-dashboard');
  };
  const showPublisherLoginFormHandler = () => {
    setShowPublisherLoginForm(true);
  };

  const handleAdminLogin = () => {
    history.push('/admin-dashboard');
  };

  return (
    <div className="container">
      <h1>Login Page</h1>

      {showPublisherLoginForm ? (
        <form onSubmit={handlePublisherLogin}>
          <input type="text" placeholder="Username" required onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" required onChange={e => setPassword(e.target.value)} />
          <button type="submit">Login</button>
          {errorMessage && <p>{errorMessage}</p>}
        </form>
      ) : (
        <button onClick={showPublisherLoginFormHandler}>Login as Publisher</button>
      )}
 <button onClick={handleStationLogin}>Login as Station</button>
      <button onClick={handleAdminLogin}>Login as Admin</button>

    </div>
  );
};

export default LoginPage;
