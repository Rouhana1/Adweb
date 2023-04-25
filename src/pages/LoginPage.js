import React from 'react';
import { useHistory } from 'react-router-dom';

const LoginPage = () => {
  const history = useHistory();

  const handlePublisherLogin = () => {
    history.push('/publisher-dashboard');
  };

  const handleStationLogin = () => {
    history.push('/station-dashboard');
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handlePublisherLogin}>Login as Publisher</button>
      <button onClick={handleStationLogin}>Login as Station</button>
    </div>
  );
};

export default LoginPage;
